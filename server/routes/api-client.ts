import { Router, Request, Response, NextFunction } from "express";
import { db } from "../../src/db/index.ts";
import { 
  users, 
  clientProjects, 
  clientInvoices, 
  clientPayments, 
  supportTickets, 
  ticketMessages, 
  sharedFiles 
} from "../../src/db/schema.ts";
import { eq, desc, and } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../../src/middleware/auth.ts";

const router = Router();

// Middleware to ensure the user is a client (or admin viewing as client, but let's just make sure they are authenticated and we use their ID)
// For security, a client can only access data where clientId === req.dbUser.id
// We use requireAuth to populate req.user, but we also need req.dbUser loaded.
const requireClient = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });

  try {
    const dbUsers = await db.select().from(users).where(eq(users.uid, req.user.uid));
    const user = dbUsers[0];

    if (!user) {
      return res.status(401).json({ error: "User profile not found" });
    }

    req.dbUser = user;
    // We can allow admin/super_admin or client
    next();
  } catch (err) {
    console.error("Error checking DB user:", err);
    return res.status(500).json({ error: "Internal server error checking permissions" });
  }
};

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req as AuthRequest, res, next)).catch((err) => {
    console.error("Client API Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  });
};

router.use(requireAuth, requireClient);

/* ==========================================================================
   PROJECTS
   ========================================================================== */
router.get("/projects", asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await db.select().from(clientProjects).where(eq(clientProjects.clientId, req.dbUser.id)).orderBy(desc(clientProjects.createdAt));
  res.json(data);
}));

/* ==========================================================================
   INVOICES
   ========================================================================== */
router.get("/invoices", asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await db.select().from(clientInvoices).where(eq(clientInvoices.clientId, req.dbUser.id)).orderBy(desc(clientInvoices.createdAt));
  res.json(data);
}));

/* ==========================================================================
   PAYMENTS
   ========================================================================== */
router.get("/payments", asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await db.select().from(clientPayments).where(eq(clientPayments.clientId, req.dbUser.id)).orderBy(desc(clientPayments.createdAt));
  res.json(data);
}));

router.post("/payments", asyncHandler(async (req: AuthRequest, res: Response) => {
  // Simulate payment
  const { invoiceId, amount, paymentMethod } = req.body;
  if (!invoiceId || !amount) {
    return res.status(400).json({ error: "invoiceId and amount required" });
  }

  const invoices = await db.select().from(clientInvoices).where(and(eq(clientInvoices.id, invoiceId), eq(clientInvoices.clientId, req.dbUser.id)));
  if (invoices.length === 0) return res.status(404).json({ error: "Invoice not found or unauthorized" });

  const inserted = await db.insert(clientPayments).values({
    clientId: req.dbUser.id,
    invoiceId,
    amount,
    paymentMethod: paymentMethod || "Stripe",
    transactionId: "txn_" + Math.random().toString(36).substring(2, 10),
    status: "completed"
  }).returning();

  await db.update(clientInvoices).set({ status: 'Paid' }).where(eq(clientInvoices.id, invoiceId));

  res.status(201).json(inserted[0]);
}));

/* ==========================================================================
   SUPPORT TICKETS
   ========================================================================== */
router.get("/support-tickets", asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await db.select().from(supportTickets).where(eq(supportTickets.clientId, req.dbUser.id)).orderBy(desc(supportTickets.createdAt));
  res.json(data);
}));

router.post("/support-tickets", asyncHandler(async (req: AuthRequest, res: Response) => {
  const inserted = await db.insert(supportTickets).values({
    ...req.body,
    clientId: req.dbUser.id
  }).returning();
  res.status(201).json(inserted[0]);
}));

router.get("/support-tickets/:id/messages", asyncHandler(async (req: AuthRequest, res: Response) => {
  const ticketId = parseInt(req.params.id);
  // Verify ownership
  const tickets = await db.select().from(supportTickets).where(and(eq(supportTickets.id, ticketId), eq(supportTickets.clientId, req.dbUser.id)));
  if (tickets.length === 0) return res.status(404).json({ error: "Ticket not found" });

  const data = await db.select().from(ticketMessages).where(eq(ticketMessages.ticketId, ticketId)).orderBy(ticketMessages.createdAt);
  res.json(data);
}));

router.post("/support-tickets/:id/messages", asyncHandler(async (req: AuthRequest, res: Response) => {
  const ticketId = parseInt(req.params.id);
  const tickets = await db.select().from(supportTickets).where(and(eq(supportTickets.id, ticketId), eq(supportTickets.clientId, req.dbUser.id)));
  if (tickets.length === 0) return res.status(404).json({ error: "Ticket not found" });

  const inserted = await db.insert(ticketMessages).values({
    ticketId,
    senderId: req.dbUser.id,
    message: req.body.message
  }).returning();

  res.status(201).json(inserted[0]);
}));

/* ==========================================================================
   FILES
   ========================================================================== */
router.get("/files", asyncHandler(async (req: AuthRequest, res: Response) => {
  const data = await db.select().from(sharedFiles).where(eq(sharedFiles.clientId, req.dbUser.id)).orderBy(desc(sharedFiles.createdAt));
  res.json(data);
}));

router.post("/files", asyncHandler(async (req: AuthRequest, res: Response) => {
  const inserted = await db.insert(sharedFiles).values({
    ...req.body,
    clientId: req.dbUser.id,
    uploadedById: req.dbUser.id
  }).returning();
  res.status(201).json(inserted[0]);
}));

/* ==========================================================================
   PROFILE
   ========================================================================== */
router.put("/profile", asyncHandler(async (req: AuthRequest, res: Response) => {
  const { fullName, avatarUrl } = req.body;
  const updated = await db.update(users).set({
    fullName,
    avatarUrl
  }).where(eq(users.id, req.dbUser.id)).returning();
  
  res.json(updated[0]);
}));

export default router;
