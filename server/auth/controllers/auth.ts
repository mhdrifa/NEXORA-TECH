import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import { AuthServiceDB } from "../services/db";
import { EmailService } from "../services/email";
import { hashPassword, verifyPassword, signToken } from "../../utils/crypto";
import { AuthenticatedRequest, RoleType } from "../types";
import { dbInstance } from "../../db/repository";

export class AuthController {
  
  /**
   * 1. User Registration (POST /api/auth/register)
   */
  public static async register(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, password, roleId } = req.body;
      const formattedEmail = email.toLowerCase().trim();

      // Check unique email
      const existing = await AuthServiceDB.findUserByEmail(formattedEmail);
      if (existing) {
        return res.status(409).json({ error: "An account with this email address is already registered." });
      }

      // Hash password
      const passwordHash = hashPassword(password);
      const chosenRole = (roleId as RoleType) || "client";

      // Save user to core ledger
      const newUser = await AuthServiceDB.createUser({
        email: formattedEmail,
        firstName,
        lastName,
        passwordHash,
        roleId: chosenRole,
        isVerified: false // Default false, must verify email
      });

      // Dispatch Email Verification token
      const verificationToken = crypto.randomBytes(32).toString("hex");
      await AuthServiceDB.createEmailVerification(newUser.id, verificationToken);
      
      // Dispatch emails
      await EmailService.sendWelcome(newUser.email, `${newUser.firstName} ${newUser.lastName}`);
      await EmailService.sendVerification(newUser.email, `${newUser.firstName} ${newUser.lastName}`, verificationToken);

      // Audit Successful Registration event
      dbInstance.writeAuditLog({
        userId: newUser.id,
        userEmail: newUser.email,
        action: "SUCCESSFUL_REGISTRATION",
        ipAddress: req.ip || "127.0.0.1",
        endpoint: "/api/auth/register",
        status: "success",
        details: `Account established with security class ${chosenRole}. Verification email dispatched.`
      });

      // Generate Access Token & Refresh Token session
      const deviceSessionId = crypto.randomBytes(16).toString("hex");
      const accessToken = signToken({
        id: newUser.id,
        email: newUser.email,
        role: newUser.roleId as RoleType,
        fullName: `${newUser.firstName} ${newUser.lastName}`,
        deviceSessionId
      }, 900); // 15 Minutes (900 seconds)

      const refreshToken = crypto.randomBytes(64).toString("hex");
      await AuthServiceDB.saveRefreshToken(newUser.id, refreshToken);

      // Set Refresh Token inside secure Cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Days
      });

      return res.status(201).json({
        message: "Registration fully synchronized. Operational accounts setup completed.",
        accessToken,
        refreshToken, // Return in response body as well for environments where cookies are blocked
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email,
          role: newUser.roleId as RoleType,
          isVerified: newUser.isVerified
        }
      });
    } catch (err: any) {
      console.error("[Registration Error]", err);
      return res.status(500).json({ error: "System failed processing your registration request." });
    }
  }

  /**
   * 2. User Login with Lockout Limits (POST /api/auth/login)
   */
  public static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const formattedEmail = email.toLowerCase().trim();
      const ip = req.ip || "127.0.0.1";
      const userAgent = req.headers["user-agent"] || "Unknown Client Device";

      const user = await AuthServiceDB.findUserByEmail(formattedEmail);
      if (!user) {
        // Return misleading error strictly to prevent email harvesting security issues
        return res.status(401).json({ error: "Invalid credentials. Please verify your email and passcode." });
      }

      // Check Account Lockout status
      if (user.lockedUntil && user.lockedUntil > new Date()) {
        const cooldownMinutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
        
        dbInstance.writeAuditLog({
          userId: user.id,
          userEmail: user.email,
          action: "BLOCKED_LOCKOUT_EXECUTION",
          ipAddress: ip,
          endpoint: "/api/auth/login",
          status: "failed",
          details: `Login execution blocked. Account locked down due to brute-force security controls. Cooldown remaining: ${cooldownMinutes}m.`
        });

        return res.status(423).json({
          error: `Security lockout activated. Account is suspended temporarily relative to 5 failed logins. Please retry in ${cooldownMinutes} minutes.`
        });
      }

      // Validate passcode hashes
      const isValid = verifyPassword(password, user.password);
      if (!isValid) {
        // Increment fails
        await AuthServiceDB.incrementFailedAttempts(user.id, user.failedLoginAttempts);
        
        dbInstance.writeAuditLog({
          userId: user.id,
          userEmail: user.email,
          action: "FAILED_LOGIN_ATTEMPT",
          ipAddress: ip,
          endpoint: "/api/auth/login",
          status: "failed",
          details: `Password verification failed. Total failures calculated: ${user.failedLoginAttempts + 1}/5.`
        });

        const attemptsLeft = 5 - (user.failedLoginAttempts + 1);
        return res.status(401).json({
          error: attemptsLeft > 0 
            ? `Invalid credentials. You have ${attemptsLeft} attempts remaining before secure lockout.`
            : `Security lockout activated. Too many failures. This account is locked for the next 15 minutes.`
        });
      }

      // Reset failed attempts on success
      await AuthServiceDB.resetFailedAttempts(user.id);

      // Record last login log
      await AuthServiceDB.updateLastLogin(user.id);

      // Device/Session Management Tracking
      const deviceSessionId = crypto.randomBytes(16).toString("hex");

      dbInstance.writeAuditLog({
        userId: user.id,
        userEmail: user.email,
        action: "USER_LOGIN",
        ipAddress: ip,
        endpoint: "/api/auth/login",
        status: "success",
        details: `Successful logging from device footprint: [${userAgent}]. JWT keys generated.`
      });

      // Issue access token (Expire: 15 Min)
      const accessToken = signToken({
        id: user.id,
        email: user.email,
        role: user.roleId as RoleType,
        fullName: `${user.firstName} ${user.lastName}`,
        deviceSessionId
      }, 900); // 15 Min

      // Issue refresh token (Expire: 7 Days)
      const refreshToken = crypto.randomBytes(64).toString("hex");
      await AuthServiceDB.saveRefreshToken(user.id, refreshToken);

      // Write cookie
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Days
      });

      return res.status(200).json({
        message: "Authentication successful. Enterprise session token generated.",
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.roleId as RoleType,
          isVerified: user.isVerified
        }
      });
    } catch (err) {
      console.error("[Login Error]", err);
      return res.status(500).json({ error: "Internal security engine error during login transaction." });
    }
  }

  /**
   * 3. User Logout (POST /api/auth/logout)
   */
  public static async logout(req: Request, res: Response) {
    try {
      const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
      if (refreshToken) {
        await AuthServiceDB.deleteRefreshToken(refreshToken);
      }

      // Clear standard JWT session credentials
      res.clearCookie("refreshToken");

      return res.status(200).json({
        message: "Successfully signed out. Device session tokens revoked cleanly."
      });
    } catch (err) {
      return res.status(500).json({ error: "System failed during session sign out transaction." });
    }
  }

  /**
   * 4. Refresh Access Token with Token Rotation (POST /api/auth/refresh-token)
   */
  public static async refresh(req: Request, res: Response) {
    try {
      const refreshToken = req.body.refreshToken || req.cookies?.refreshToken;
      if (!refreshToken) {
        return res.status(400).json({ error: "A valid refresh token token is required." });
      }

      const freshToken = crypto.randomBytes(64).toString("hex");
      const user = await AuthServiceDB.validateAndRotateRefreshToken(refreshToken, freshToken);

      if (!user) {
        return res.status(401).json({ error: "Refresh token is expired, revoked, or invalid." });
      }

      // Issue rotated Session token & Access token
      const deviceSessionId = crypto.randomBytes(16).toString("hex");
      const accessToken = signToken({
        id: user.id,
        email: user.email,
        role: user.roleId as RoleType,
        fullName: `${user.firstName} ${user.lastName}`,
        deviceSessionId
      }, 900); // 15 Min

      // Update cookie
      res.cookie("refreshToken", freshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 Days
      });

      return res.status(200).json({
        message: "Tokens rotated successfully.",
        accessToken,
        refreshToken: freshToken
      });
    } catch (err) {
      return res.status(500).json({ error: "Unable to refresh authentication session." });
    }
  }

  /**
   * 5. Forgot Password (POST /api/auth/forgot-password)
   */
  public static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const formattedEmail = email.toLowerCase().trim();

      const user = await AuthServiceDB.findUserByEmail(formattedEmail);
      if (!user) {
        // Return 200 message strictly for privacy reasons to prevent user enumeration
        return res.status(200).json({
          message: "If credentials matching this record exist in our system, a password recovery dispatch was sent."
        });
      }

      // Generate Reset Token
      const resetToken = crypto.randomBytes(32).toString("hex");
      await AuthServiceDB.createPasswordReset(user.email, resetToken);

      // Dispatch Reset Password email
      await EmailService.sendForgotPassword(user.email, `${user.firstName} ${user.lastName}`, resetToken);

      dbInstance.writeAuditLog({
        userId: user.id,
        userEmail: user.email,
        action: "PASSWORD_RESET_SUBMITTED",
        ipAddress: req.ip || "127.0.0.1",
        endpoint: "/api/auth/forgot-password",
        status: "success",
        details: "Password reset link injected and dispatched to verified mail address."
      });

      return res.status(200).json({
        message: "If credentials matching this record exist in our system, a password recovery dispatch was sent."
      });
    } catch (err) {
      console.error("[ForgotPassword Error]", err);
      return res.status(500).json({ error: "Unable to parse password recovery request." });
    }
  }

  /**
   * 6. Reset Password (POST /api/auth/reset-password)
   */
  public static async resetPassword(req: Request, res: Response) {
    try {
      const { token, password } = req.body;

      const passwordHash = hashPassword(password);
      const user = await AuthServiceDB.completePasswordReset(token, passwordHash) as any;

      if (!user) {
        return res.status(400).json({ error: "Your reset token is invalid, expired, or has already been used." });
      }

      // Revoke all session tokens for safety of password change
      await AuthServiceDB.revokeAllUserTokens(user.id);
      
      // Dispatch Password Changed confirmation alert email
      await EmailService.sendPasswordChanged(user.email, `${user.firstName} ${user.lastName}`);

      dbInstance.writeAuditLog({
        userId: user.id,
        userEmail: user.email,
        action: "PASSWORD_RESET_COMPLETED",
        ipAddress: req.ip || "127.0.0.1",
        endpoint: "/api/auth/reset-password",
        status: "success",
        details: "Account password rebuilt via safe tokens system. Standard sessions terminated."
      });

      return res.status(200).json({
        message: "Password change has completed successfully. All other active workspace connections were signed out."
      });
    } catch (err) {
      return res.status(500).json({ error: "Internal error while resetting user passcode." });
    }
  }

  /**
   * 7. Change Password (POST /api/auth/change-password)
   */
  public static async changePassword(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Session authentication required." });
      }

      const { currentPassword, newPassword } = req.body;
      const user = await AuthServiceDB.findUserByEmail(req.user.email);

      if (!user) {
        return res.status(404).json({ error: "User profile record not found." });
      }

      // Check current password
      const isValid = verifyPassword(currentPassword, user.password);
      if (!isValid) {
        return res.status(400).json({ error: "Your current password verification has failed." });
      }

      // Hash and Update
      const passwordHash = hashPassword(newPassword);
      await AuthServiceDB.updatePassword(user.id, passwordHash);

      // Terminate other active sessions for extra safety
      await AuthServiceDB.revokeAllUserTokens(user.id);

      // Post warning email
      await EmailService.sendPasswordChanged(user.email, `${user.firstName} ${user.lastName}`);

      dbInstance.writeAuditLog({
        userId: user.id,
        userEmail: user.email,
        action: "PASSWORD_CHANGED_BY_USER",
        ipAddress: req.ip || "127.0.0.1",
        endpoint: "/api/auth/change-password",
        status: "success",
        details: "User manual password update execution successful."
      });

      return res.status(200).json({
        message: "Your password was safely updated. Client device pipelines signed off."
      });
    } catch (err) {
      return res.status(500).json({ error: "System fault updating security passcode." });
    }
  }

  /**
   * 8. Email Verification (POST /api/auth/verify-email)
   */
  public static async verifyEmail(req: Request, res: Response) {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ error: "Verification token parameter is required." });
      }

      const user = await AuthServiceDB.verifyEmailAndActivate(token);
      if (!user) {
        return res.status(400).json({ error: "Activation token expired or is invalid." });
      }

      dbInstance.writeAuditLog({
        userId: user.id,
        userEmail: user.email,
        action: "EMAIL_VERIFICATION_COMPLETED",
        ipAddress: req.ip || "127.0.0.1",
        endpoint: "/api/auth/verify-email",
        status: "success",
        details: "Corporate verification completed. Global RBAC access unlocked."
      });

      return res.status(200).json({
        message: "Email address verified successfully. Your account is active."
      });
    } catch (err) {
      return res.status(500).json({ error: "System failure performing verification loop." });
    }
  }

  /**
   * 9. Get Current Active User (GET /api/auth/me)
   */
  public static async me(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Verification failed." });
      }

      const user = await AuthServiceDB.findUserByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({ error: "Corporate user identity profile record not found." });
      }

      return res.status(200).json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: `${user.firstName} ${user.lastName}`,
        role: user.roleId as any,
        isVerified: user.isVerified,
        status: user.status,
        lastLogin: user.lastLogin
      });
    } catch (err) {
      return res.status(500).json({ error: "Unable to load current secure profile info." });
    }
  }

  /**
   * 10. Compatibility Session Check (GET /api/auth/session)
   */
  public static async session(req: AuthenticatedRequest, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Verification failed." });
      }

      const user = await AuthServiceDB.findUserByEmail(req.user.email);
      if (!user) {
        return res.status(404).json({ error: "Corporate user identity profile record not found." });
      }

      return res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          fullName: `${user.firstName} ${user.lastName}`,
          role: user.roleId as any,
          isVerified: user.isVerified,
          avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"
        }
      });
    } catch (err) {
      return res.status(500).json({ error: "Failed listing user security session." });
    }
  }
}
