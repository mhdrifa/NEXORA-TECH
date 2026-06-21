import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import apiRouter from "./server/routes/api.ts";
import seoRouter from "./server/routes/seo.ts";
import { strictHelmet, globalLimiter } from "./server/utils/security.ts";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Basic payload parsing
  app.use(express.json({ limit: "15mb" }));
  app.use(express.urlencoded({ extended: true, limit: "15mb" }));

  // Security Headers Setup
  app.use(strictHelmet);
  app.use(globalLimiter);

  // Force HTTPS in production
  if (process.env.NODE_ENV === "production" && !process.env.ALLOW_INSECURE_HTTP) {
    app.use((req, res, next) => {
      // Trust x-forwarded-proto if behind proxy (like Cloud Run)
      if (req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`);
      } else {
        next();
      }
    });
  }

  // CORS and base level security
  app.use(cors());

  // Mount enterprise REST API router
  app.use("/api", apiRouter);
  
  // Mount SEO utility routes (sitemap.xml, robots.txt)
  app.use("/", seoRouter);

  // Base level status check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "NEXORA_ENTERPRISE_CORE",
      uptime: process.uptime()
    });
  });

  // Serve static assets in production or mount Vite middleware in development
  if (process.env.NODE_ENV !== "production") {
    console.log("[Nexora Server] Launching Vite development server proxy... (MiddlewareMode)");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("[Nexora Server] Serving production static bundles from /dist...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Nexora Enterprise Server] Running on http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("[Nexora Server] CRITICAL INIT FAILURE:", error);
});
