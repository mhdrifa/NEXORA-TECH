import { Router, Request, Response } from "express";
import { db } from "../../src/db/index.ts";
import { blogPosts } from "../../src/db/schema.ts";
import { eq } from "drizzle-orm";

const router = Router();

router.get("/sitemap.xml", async (req: Request, res: Response) => {
  try {
    const baseUrl =
      process.env.APP_URL ||
      (req.get("host")
        ? `https://${req.get("host")}`
        : "https://nexoratech.com");

    // Core routes
    const coreRoutes = [
      "",
      "/services",
      "/about",
      "/portfolio",
      "/contact",
      "/blog",
      "/portal", // Login page
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

    // Add core routes
    coreRoutes.forEach((route) => {
      sitemap += `
  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${route === "" ? "1.0" : "0.8"}</priority>
  </url>`;
    });

    // Add dynamic Blog Posts
    const publishedPages = await db
      .select()
      .from(blogPosts)
      .where(eq(blogPosts.status, "published"));

    publishedPages.forEach((page) => {
      const path = `/blog/${page.slug}`;
      if (!coreRoutes.includes(path)) {
        sitemap += `
  <url>
    <loc>${baseUrl}${path}</loc>
    <lastmod>${page.updatedAt ? page.updatedAt.toISOString().split("T")[0] : new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
      }
    });

    sitemap += `\n</urlset>`;

    res.header("Content-Type", "application/xml");
    res.status(200).send(sitemap);
  } catch (error) {
    console.error("Sitemap generation error:", error);
    res.status(500).end();
  }
});

// Also serve robots.txt dynamically to match the site URL
router.get("/robots.txt", (req: Request, res: Response) => {
  const baseUrl =
    process.env.APP_URL ||
    (req.get("host") ? `https://${req.get("host")}` : "https://nexoratech.com");
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /api/
Disallow: /portal/* 
Disallow: /admin/*

Sitemap: ${baseUrl}/sitemap.xml`;

  res.header("Content-Type", "text/plain");
  res.status(200).send(robotsTxt);
});

export default router;
