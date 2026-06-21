import { Router, Request, Response, NextFunction } from "express";
import { db } from "../../src/db/index.ts";
import { 
  users, 
  homepageContent, 
  services, 
  aboutContent, 
  teamMembers, 
  portfolioProjects, 
  testimonials, 
  blogPosts, 
  careers, 
  contactInformation, 
  seoSettings, 
  websiteSettings, 
  mediaLibrary 
} from "../../src/db/schema.ts";
import { eq, desc } from "drizzle-orm";
import { requireAuth, requireAdmin, AuthRequest } from "../../src/middleware/auth.ts";

const router = Router();

// Wrap route to catch errors
const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    console.error("API Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  });
};

/* ==========================================================================
   HOMEPAGE CONTENT
   ========================================================================== */
router.get("/homepage", asyncHandler(async (req: Request, res: Response) => {
  const content = await db.select().from(homepageContent).limit(1);
  res.json(content[0] || {});
}));

router.put("/homepage", requireAuth, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const existing = await db.select().from(homepageContent).limit(1);
  if (existing.length === 0) {
    const inserted = await db.insert(homepageContent).values(req.body).returning();
    return res.json(inserted[0]);
  } else {
    const updated = await db.update(homepageContent).set(req.body).where(eq(homepageContent.id, existing[0].id)).returning();
    return res.json(updated[0]);
  }
}));

/* ==========================================================================
   SERVICES
   ========================================================================== */
router.get("/services", asyncHandler(async (req: Request, res: Response) => {
  const data = await db.select().from(services).orderBy(services.orderIndex);
  res.json(data);
}));

router.post("/services", requireAuth, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const inserted = await db.insert(services).values(req.body).returning();
  res.status(201).json(inserted[0]);
}));

router.put("/services/:id", requireAuth, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const updated = await db.update(services).set(req.body).where(eq(services.id, parseInt(req.params.id))).returning();
  res.json(updated[0]);
}));

router.delete("/services/:id", requireAuth, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  await db.delete(services).where(eq(services.id, parseInt(req.params.id)));
  res.json({ success: true });
}));

/* ==========================================================================
   ABOUT CONTENT
   ========================================================================== */
router.get("/about", asyncHandler(async (req: Request, res: Response) => {
  const content = await db.select().from(aboutContent).limit(1);
  res.json(content[0] || {});
}));

router.put("/about", requireAuth, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const existing = await db.select().from(aboutContent).limit(1);
  if (existing.length === 0) {
    const inserted = await db.insert(aboutContent).values(req.body).returning();
    return res.json(inserted[0]);
  } else {
    const updated = await db.update(aboutContent).set(req.body).where(eq(aboutContent.id, existing[0].id)).returning();
    return res.json(updated[0]);
  }
}));

/* ==========================================================================
   TEAM MEMBERS
   ========================================================================== */
router.get("/team", asyncHandler(async (req: Request, res: Response) => {
  const data = await db.select().from(teamMembers).orderBy(teamMembers.displayOrder);
  res.json(data);
}));

router.post("/team", requireAuth, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const inserted = await db.insert(teamMembers).values(req.body).returning();
  res.status(201).json(inserted[0]);
}));

router.put("/team/:id", requireAuth, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const updated = await db.update(teamMembers).set(req.body).where(eq(teamMembers.id, parseInt(req.params.id))).returning();
  res.json(updated[0]);
}));

router.delete("/team/:id", requireAuth, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  await db.delete(teamMembers).where(eq(teamMembers.id, parseInt(req.params.id)));
  res.json({ success: true });
}));

/* ==========================================================================
   PORTFOLIO PROJECTS
   ========================================================================== */
router.get("/portfolio", asyncHandler(async (req: Request, res: Response) => {
  const data = await db.select().from(portfolioProjects).orderBy(desc(portfolioProjects.createdAt));
  res.json(data);
}));

router.post("/portfolio", requireAuth, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const inserted = await db.insert(portfolioProjects).values(req.body).returning();
  res.status(201).json(inserted[0]);
}));

router.put("/portfolio/:id", requireAuth, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const updated = await db.update(portfolioProjects).set(req.body).where(eq(portfolioProjects.id, parseInt(req.params.id))).returning();
  res.json(updated[0]);
}));

router.delete("/portfolio/:id", requireAuth, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  await db.delete(portfolioProjects).where(eq(portfolioProjects.id, parseInt(req.params.id)));
  res.json({ success: true });
}));

/* ==========================================================================
   TESTIMONIALS
   ========================================================================== */
router.get("/testimonials", asyncHandler(async (req: Request, res: Response) => {
  const data = await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
  res.json(data);
}));

router.post("/testimonials", requireAuth, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const inserted = await db.insert(testimonials).values(req.body).returning();
  res.status(201).json(inserted[0]);
}));

router.put("/testimonials/:id", requireAuth, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const updated = await db.update(testimonials).set(req.body).where(eq(testimonials.id, parseInt(req.params.id))).returning();
  res.json(updated[0]);
}));

router.delete("/testimonials/:id", requireAuth, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  await db.delete(testimonials).where(eq(testimonials.id, parseInt(req.params.id)));
  res.json({ success: true });
}));

/* ==========================================================================
   BLOG POSTS
   ========================================================================== */
router.get("/blog", asyncHandler(async (req: Request, res: Response) => {
  const data = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
  res.json(data);
}));

router.post("/blog", requireAuth, requireAdmin, asyncHandler(async (req: AuthRequest, res: Response) => {
  const authorId = req.dbUser.id;
  const inserted = await db.insert(blogPosts).values({ ...req.body, authorId }).returning();
  res.status(201).json(inserted[0]);
}));

router.put("/blog/:id", requireAuth, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const updated = await db.update(blogPosts).set(req.body).where(eq(blogPosts.id, parseInt(req.params.id))).returning();
  res.json(updated[0]);
}));

router.delete("/blog/:id", requireAuth, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  await db.delete(blogPosts).where(eq(blogPosts.id, parseInt(req.params.id)));
  res.json({ success: true });
}));

/* ==========================================================================
   CAREERS
   ========================================================================== */
router.get("/careers", asyncHandler(async (req: Request, res: Response) => {
  const data = await db.select().from(careers).orderBy(desc(careers.createdAt));
  res.json(data);
}));

router.post("/careers", requireAuth, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const inserted = await db.insert(careers).values(req.body).returning();
  res.status(201).json(inserted[0]);
}));

router.put("/careers/:id", requireAuth, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const updated = await db.update(careers).set(req.body).where(eq(careers.id, parseInt(req.params.id))).returning();
  res.json(updated[0]);
}));

router.delete("/careers/:id", requireAuth, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  await db.delete(careers).where(eq(careers.id, parseInt(req.params.id)));
  res.json({ success: true });
}));

/* ==========================================================================
   CONTACT INFORMATION
   ========================================================================== */
router.get("/contact", asyncHandler(async (req: Request, res: Response) => {
  const content = await db.select().from(contactInformation).limit(1);
  res.json(content[0] || {});
}));

router.put("/contact", requireAuth, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const existing = await db.select().from(contactInformation).limit(1);
  if (existing.length === 0) {
    const inserted = await db.insert(contactInformation).values(req.body).returning();
    return res.json(inserted[0]);
  } else {
    const updated = await db.update(contactInformation).set(req.body).where(eq(contactInformation.id, existing[0].id)).returning();
    return res.json(updated[0]);
  }
}));

/* ==========================================================================
   SEO SETTINGS
   ========================================================================== */
router.get("/seo/:page", asyncHandler(async (req: Request, res: Response) => {
  const data = await db.select().from(seoSettings).where(eq(seoSettings.page, req.params.page)).limit(1);
  res.json(data[0] || {});
}));

router.put("/seo/:page", requireAuth, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const existing = await db.select().from(seoSettings).where(eq(seoSettings.page, req.params.page)).limit(1);
  if (existing.length === 0) {
    const inserted = await db.insert(seoSettings).values({ ...req.body, page: req.params.page }).returning();
    return res.json(inserted[0]);
  } else {
    const updated = await db.update(seoSettings).set(req.body).where(eq(seoSettings.id, existing[0].id)).returning();
    return res.json(updated[0]);
  }
}));

/* ==========================================================================
   WEBSITE SETTINGS
   ========================================================================== */
router.get("/settings", asyncHandler(async (req: Request, res: Response) => {
  const content = await db.select().from(websiteSettings).limit(1);
  res.json(content[0] || {});
}));

router.put("/settings", requireAuth, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  const existing = await db.select().from(websiteSettings).limit(1);
  if (existing.length === 0) {
    const inserted = await db.insert(websiteSettings).values(req.body).returning();
    return res.json(inserted[0]);
  } else {
    const updated = await db.update(websiteSettings).set(req.body).where(eq(websiteSettings.id, existing[0].id)).returning();
    return res.json(updated[0]);
  }
}));

/* ==========================================================================
   MEDIA LIBRARY
   ========================================================================== */
router.get("/media", asyncHandler(async (req: Request, res: Response) => {
  const data = await db.select().from(mediaLibrary).orderBy(desc(mediaLibrary.createdAt));
  res.json(data);
}));

router.post("/media", requireAuth, requireAdmin, asyncHandler(async (req: AuthRequest, res: Response) => {
  const uploadedById = req.dbUser.id;
  const inserted = await db.insert(mediaLibrary).values({ ...req.body, uploadedById }).returning();
  res.status(201).json(inserted[0]);
}));

router.delete("/media/:id", requireAuth, requireAdmin, asyncHandler(async (req: Request, res: Response) => {
  await db.delete(mediaLibrary).where(eq(mediaLibrary.id, parseInt(req.params.id)));
  res.json({ success: true });
}));

export default router;
