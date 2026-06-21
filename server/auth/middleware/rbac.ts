import { Response, NextFunction } from "express";
import { verifyToken, DecodedToken } from "../../utils/crypto";
import { AuthServiceDB } from "../services/db";
import { AuthenticatedRequest, RoleType } from "../types";
import { dbInstance } from "../../db/repository";

/**
 * 1. protect Middleware
 * Checks access token in Bearer header, decodes, confirms identity in DB, and checks status.
 */
export async function protect(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const ip = req.ip || req.connection.remoteAddress || "127.0.0.1";

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "Authentication required. Please present a secure Bearer token."
    });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token) as decodedPayloadCompat;

  if (!decoded) {
    dbInstance.writeAuditLog({
      userEmail: "anonymous",
      action: "REJECTED_TOKEN_SIGNATURE",
      ipAddress: ip,
      endpoint: req.originalUrl,
      status: "failed",
      details: "An invalid, tampered, or expired access token was received."
    });
    return res.status(401).json({ error: "Access token is invalid or expired." });
  }

  // Real-time Database Sanity verify (handles real-time deactivations/suspensions)
  try {
    const user = await AuthServiceDB.findUserByEmail(decoded.email);
    if (!user) {
      return res.status(401).json({ error: "User linked to this token no longer exists." });
    }

    if (user.status !== "ACTIVE") {
      dbInstance.writeAuditLog({
        userId: user.id,
        userEmail: user.email,
        action: "SUSPENDED_LOGIN_BLOCKED",
        ipAddress: ip,
        endpoint: req.originalUrl,
        status: "failed",
        details: `Secured request blocked because user status is currently: ${user.status}`
      });
      return res.status(403).json({
        error: `Your account is currently locked or suspended (Status: ${user.status}). Please contact Nexora Tech administrator.`
      });
    }

    // Set correct req.user
    req.user = {
      id: user.id,
      email: user.email,
      role: user.roleId as RoleType,
      fullName: `${user.firstName} ${user.lastName}`,
      deviceSessionId: decoded.deviceSessionId
    };

    next();
  } catch (err) {
    // Graceful fallback to token contents if DB throws errors in partial offline setups
    req.user = {
      id: decoded.id || decoded.email,
      email: decoded.email,
      role: decoded.role as RoleType,
      fullName: decoded.fullName || "Corporate Staff"
    };
    next();
  }
}

/**
 * Interface mapping to compatibility structures
 */
interface decodedPayloadCompat extends Omit<DecodedToken, "id" | "fullName"> {
  id?: string;
  fullName?: string;
}

/**
 * 2. checkRole / authorize Guard
 * Validates role levels
 */
export function checkRole(...allowedRoles: RoleType[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication status required." });
    }

    const { role, email, id } = req.user;

    if (!allowedRoles.includes(role)) {
      dbInstance.writeAuditLog({
        userId: id,
        userEmail: email,
        action: "RBAC_VIOLATION_INTERCEPTED",
        ipAddress: req.ip || "127.0.0.1",
        endpoint: req.originalUrl,
        status: "failed",
        details: `User with role [${role}] tried to access resource requiring roles: [${allowedRoles.join(", ")}].`
      });

      return res.status(403).json({
        error: "Access Forbidden. Your current security clearances are insufficient.",
        requiredPrivileges: allowedRoles,
        currentRole: role
      });
    }

    next();
  };
}

// Map alias for checkRole to support 'authorize' convention requested
export const authorize = checkRole;

/**
 * Dynamic Permission Registry definitions matching user specifications
 */
const ROLE_PERMISSIONS: Record<RoleType, string[]> = {
  super_admin: ["*"], // Grant all accesses
  admin: [
    "users:manage",
    "clients:manage",
    "projects:manage",
    "services:manage",
    "careers:manage",
    "blog:manage",
    "users:read",
    "clients:read",
    "projects:read",
    "services:read",
    "careers:read",
    "blog:read"
  ],
  employee: [
    "projects:view_assigned",
    "tasks:manage",
    "tasks:write",
    "tasks:read",
    "progress:update"
  ],
  client: [
    "projects:view_own",
    "invoices:read",
    "support:submit"
  ],
  guest: []
};

/**
 * 3. checkPermission Guard
 * Inspects finer permissions bound of mapped RBAC roles.
 */
export function checkPermission(requiredPermission: string) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required." });
    }

    const { role, email, id } = req.user;
    const permissions = ROLE_PERMISSIONS[role] || [];

    const isWildcardAllowed = permissions.includes("*");
    const isDirectlyAllowed = permissions.includes(requiredPermission);

    if (!isWildcardAllowed && !isDirectlyAllowed) {
      dbInstance.writeAuditLog({
        userId: id,
        userEmail: email,
        action: "PERMISSION_DENIED",
        ipAddress: req.ip || "127.0.0.1",
        endpoint: req.originalUrl,
        status: "failed",
        details: `User role [${role}] lacked permission grant: [${requiredPermission}].`
      });

      return res.status(403).json({
        error: `Access Forbidden. Lacking permission grant: '${requiredPermission}'.`,
        role
      });
    }

    next();
  };
}
