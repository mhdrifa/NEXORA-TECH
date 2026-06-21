import { Request, Response, NextFunction } from "express";
import { dbInstance } from "../db/repository";

// Simple Rate Limiter state
interface RateLimitRecord {
  count: number;
  resetTime: number;
}
const rateLimits = new Map<string, RateLimitRecord>();

/**
 * 1. Rate Limiting Middleware
 * Restricts client requests to prevent DDOS & brute force.
 */
export function rateLimiter(limit: number = 100, windowMs: number = 60000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.connection.remoteAddress || "unknown-ip";
    const now = Date.now();
    
    let record = rateLimits.get(ip);
    if (!record || now > record.resetTime) {
      record = { count: 1, resetTime: now + windowMs };
      rateLimits.set(ip, record);
    } else {
      record.count++;
    }

    if (record.count > limit) {
      // Log failed rate limit event
      dbInstance.writeAuditLog({
        userEmail: "anonymous",
        action: "RATE_LIMIT_EXCEEDED",
        ipAddress: ip,
        endpoint: req.originalUrl,
        status: "failed",
        details: `IP ${ip} crossed request limit of ${limit} in ${windowMs}ms window.`
      });
      return res.status(429).json({
        error: "Too many requests from this IP. Please wait before retrying.",
        limit,
        remaining: 0,
        resetTime: new Date(record.resetTime).toISOString()
      });
    }
    next();
  };
}

/**
 * 2. SQL Injection & XSS Input Sanitization Guard
 * Recursively scans request params, query, and body for malicious strings (e.g., OR 1=1, <script> tags).
 */
function containsMaliciousSignature(value: any): boolean {
  if (typeof value === "string") {
    const lower = value.toLowerCase();
    // SQL Injection signatures
    if (
      lower.includes("union select") ||
      lower.includes("or 1=1") ||
      lower.includes("' or '1'='1") ||
      lower.includes('" or "1"="1') ||
      lower.includes("; drop table") ||
      lower.includes("; delete from") ||
      lower.includes("--")
    ) {
      return true;
    }
    // XSS signatures
    if (
      lower.includes("<script>") ||
      lower.includes("javascript:") ||
      lower.includes("onerror=") ||
      lower.includes("onload=") ||
      lower.includes("<iframe")
    ) {
      return true;
    }
  } else if (typeof value === "object" && value !== null) {
    for (const key of Object.keys(value)) {
      if (containsMaliciousSignature(value[key])) {
        return true;
      }
    }
  }
  return false;
}

export function sqlAndXssShield(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.connection.remoteAddress || "unknown-ip";
  
  if (
    containsMaliciousSignature(req.body) ||
    containsMaliciousSignature(req.query) ||
    containsMaliciousSignature(req.params)
  ) {
    // Audit log the blocking incident
    dbInstance.writeAuditLog({
      userEmail: "anonymous-attacker",
      action: "ATTACK_SIGNATURE_BLOCKED",
      ipAddress: ip,
      endpoint: req.originalUrl,
      status: "failed",
      details: `Attack signature detected and blocked in payload. Body: ${JSON.stringify(req.body)}, Query: ${JSON.stringify(req.query)}`
    });

    return res.status(403).json({
      error: "Request blocked by Nexora security shield. Dangerous input patterns detected.",
      securityCode: "NEXORA-SHIELD-09x"
    });
  }
  next();
}

/**
 * 3. Security Headers Middleware (Helmet-like safe setup)
 * Appends HTTP response security headers for secure context.
 */
export function coreSecurityHeaders(req: Request, res: Response, next: NextFunction) {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Content-Security-Policy", "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';");
  res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  res.setHeader("Referrer-Policy", "no-referrer-when-downgrade");
  next();
}
