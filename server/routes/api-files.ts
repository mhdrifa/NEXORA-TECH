import { Router, Request, Response, NextFunction } from "express";
import { db } from "../../src/db/index.ts";
import { files, users } from "../../src/db/schema.ts";
import { eq, desc, and } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../../src/middleware/auth.ts";
import multer from 'multer';
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.ts";

const router = Router();

// Multer in memory
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req as AuthRequest, res, next)).catch((err) => {
    console.error("Files API Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  });
};

// Middleware to load DB user
const loadDbUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  try {
    const dbUsers = await db.select().from(users).where(eq(users.uid, req.user.uid));
    const user = dbUsers[0];
    if (!user) return res.status(401).json({ error: "User profile not found" });
    req.dbUser = user;
    next();
  } catch (err) {
    return res.status(500).json({ error: "Internal error checking user" });
  }
};

router.use(requireAuth, loadDbUser);

// Upload endpoint
router.post("/upload", upload.array('files', 10), asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
    return res.status(400).json({ error: "No files uploaded" });
  }

  const { fileType, clientId, projectId, visibility } = req.body;
  const uploadedFiles = req.files as Express.Multer.File[];
  const results = [];

  for (const file of uploadedFiles) {
    const ext = file.originalname.split('.').pop()?.toLowerCase() || '';
    let resourceType = 'auto';
    if (file.mimetype.startsWith('image/')) resourceType = 'image';
    else if (file.mimetype === 'application/pdf') resourceType = 'raw';
    
    // Upload to cloudinary
    const cldRes = await uploadToCloudinary(file.buffer, `nexora/files/${req.dbUser.id}`, resourceType);
    
    // Insert into DB
    const inserted = await db.insert(files).values({
      fileName: file.originalname,
      originalName: file.originalname,
      fileType: fileType || 'document',
      fileFormat: ext || file.mimetype,
      fileSize: file.size,
      url: cldRes.secure_url,
      publicId: cldRes.public_id,
      uploadedBy: req.dbUser.id,
      clientId: clientId ? parseInt(clientId) : req.dbUser.role === 'client' ? req.dbUser.id : null,
      projectId: projectId ? parseInt(projectId) : null,
      visibility: visibility || 'private'
    }).returning();
    
    results.push(inserted[0]);
  }

  res.status(201).json({ message: "Files uploaded successfully", files: results });
}));


// Get all files for the user
router.get("/", asyncHandler(async (req: AuthRequest, res: Response) => {
  // If admin/editor, can view all, otherwise only files connected to client id and uploaded by user
  let data;
  if (req.dbUser.role === 'super_admin' || req.dbUser.role === 'admin' || req.dbUser.role === 'editor') {
     data = await db.select().from(files).orderBy(desc(files.createdAt));
  } else {
     data = await db.select().from(files).where(
       and(
         eq(files.clientId, req.dbUser.id)
       )
     ).orderBy(desc(files.createdAt));
     // Also get files uploaded by this user if not assigned to a client (e.g. personal notes)
  }
  res.json(data);
}));

// Delete a file
router.delete("/:id", asyncHandler(async (req: AuthRequest, res: Response) => {
  const fileId = parseInt(req.params.id);
  const fileRows = await db.select().from(files).where(eq(files.id, fileId));
  if (fileRows.length === 0) return res.status(404).json({ error: "File not found" });
  const file = fileRows[0];

  // RBAC check
  if (file.uploadedBy !== req.dbUser.id && !['super_admin', 'admin'].includes(req.dbUser.role)) {
    return res.status(403).json({ error: "Forsibben" });
  }

  // Delete from Cloudinary if needed
  if (file.publicId) {
    await deleteFromCloudinary(file.publicId);
  }

  // Delete from DB
  await db.delete(files).where(eq(files.id, fileId));
  res.json({ success: true });
}));

export default router;
