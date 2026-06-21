import { Request, Response, NextFunction } from "express";
import { verifyToken, DecodedToken } from "../utils/crypto";
import { dbInstance } from "../db/repository";

// Extend Request type in local scope
export interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
}

/**
 * 1. authenticateJWT Middleware
 * Pulls JWT from Authorization Bearer header, validates it, and injects user to req.user.
 */
export function authenticateJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const ip = req.ip || req.connection.remoteAddress || "unknown-ip";

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(412).json({ 
      error: "Authorization header with Bearer token is missing or pre-conditions failed." 
    });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    // Audit log failed authorization
    dbInstance.writeAuditLog({
      userEmail: "unknown",
      action: "AUTH_VERIFICATION_FAILED",
      ipAddress: ip,
      endpoint: req.originalUrl,
      status: "failed",
      details: "An invalid or expired JWT token signature was presented."
    });
    return res.status(401).json({ 
      error: "Access token is invalid or expired. Please present a fresh authorization credential." 
    });
  }

  req.user = decoded;
  next();
}

/**
 * 2. authorizeRoles Guard
 * Validates if the authenticated user possesses the required role privilege.
 */
export function authorizeRoles(...allowedRoles: Array<"super_admin" | "admin" | "employee" | "client" | "guest">) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required to access this resource." });
    }

    const { role, email } = req.user;
    const ip = req.ip || req.connection.remoteAddress || "unknown-ip";

    if (!allowedRoles.includes(role)) {
      // Audit log the authorization failure
      dbInstance.writeAuditLog({
        userId: req.user.id,
        userEmail: email,
        action: "PRIVILEGE_VIOLATION_BLOCKED",
        ipAddress: ip,
        endpoint: req.originalUrl,
        status: "failed",
        details: `User with role [${role}] blocked from endpoint requiring [${allowedRoles.join(", ")}].`
      });

      return res.status(403).json({ 
        error: "Forbidden. Your user role lacks sufficient administrative permissions to interact with this resource.",
        requiredRoles: allowedRoles,
        currentRole: role
      });
    }

    next();
  };
}
