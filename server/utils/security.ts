import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Rate Limiters
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 500, // Limit each IP to 500 requests per `window` (here, per 15 minutes).
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { error: "Too many requests from this IP, please try again later." },
});

export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20, // Limit each IP to 20 requests per `window` for auth endpoints
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error:
      "Too many authentication attempts from this IP, please try again later.",
  },
});

export const strictHelmet = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'",
        "'unsafe-eval'",
        "https://www.googletagmanager.com",
      ], // Allowing tag manager if GA is added
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "data:"],
      imgSrc: [
        "'self'",
        "data:",
        "https://res.cloudinary.com",
        "https://via.placeholder.com",
        "https://images.unsplash.com",
      ],
      connectSrc: [
        "'self'",
        "https://api.cloudinary.com",
        "https://region1.google-analytics.com",
      ],
    },
  },
  crossOriginEmbedderPolicy: false,
});
