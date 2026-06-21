import { Request } from "express";

export type RoleType = "super_admin" | "admin" | "employee" | "client" | "guest";

export interface DecodedToken {
  id: string;
  email: string;
  role: RoleType;
  fullName: string;
  deviceSessionId?: string;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  user?: DecodedToken;
}

export interface AuthUserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: RoleType;
  isVerified: boolean;
  status: string;
  lastLogin: string | null;
  createdAt: string;
}

export interface SessionInfo {
  token: string;
  deviceSessionId: string;
  userAgent: string;
  ipAddress: string;
}
