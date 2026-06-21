import { Request, Response, NextFunction } from "express";

/**
 * Validates password complexity:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */
export function validatePasswordStrength(password: string): string | null {
  if (!password || password.length < 8) {
    return "Password must be at least 8 characters long.";
  }
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }
  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number.";
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return "Password must contain at least one special character (e.g., !, @, #, $, %, ^, &).";
  }
  return null;
}

/**
 * Middleware: Validate Registration fields and strength
 */
export function validateRegister(req: Request, res: Response, next: NextFunction) {
  const { firstName, lastName, email, password } = req.body;

  if (!firstName || typeof firstName !== "string" || firstName.trim() === "") {
    return res.status(400).json({ error: "First Name is required." });
  }

  if (!lastName || typeof lastName !== "string" || lastName.trim() === "") {
    return res.status(400).json({ error: "Last Name is required." });
  }

  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "A valid Email address is required." });
  }

  const passwordError = validatePasswordStrength(password);
  if (passwordError) {
    return res.status(400).json({ error: passwordError });
  }

  next();
}

/**
 * Middleware: Validate Login fields
 */
export function validateLogin(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body;

  if (!email || typeof email !== "string" || email.trim() === "") {
    return res.status(400).json({ error: "Email is required." });
  }

  if (!password || typeof password !== "string" || password.trim() === "") {
    return res.status(400).json({ error: "Password is required." });
  }

  next();
}

/**
 * Middleware: Validate Forgot Password fields
 */
export function validateForgotPassword(req: Request, res: Response, next: NextFunction) {
  const { email } = req.body;

  if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: "A valid Email address is required." });
  }

  next();
}

/**
 * Middleware: Validate Reset Password fields
 */
export function validateResetPassword(req: Request, res: Response, next: NextFunction) {
  const { token, password } = req.body;

  if (!token || typeof token !== "string" || token.trim() === "") {
    return res.status(400).json({ error: "Reset token is required." });
  }

  const passwordError = validatePasswordStrength(password);
  if (passwordError) {
    return res.status(400).json({ error: passwordError });
  }

  next();
}

/**
 * Middleware: Validate Change Password fields
 */
export function validateChangePassword(req: Request, res: Response, next: NextFunction) {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || typeof currentPassword !== "string" || currentPassword.trim() === "") {
    return res.status(400).json({ error: "Current password is required." });
  }

  const passwordError = validatePasswordStrength(newPassword);
  if (passwordError) {
    return res.status(400).json({ error: passwordError });
  }

  if (currentPassword === newPassword) {
    return res.status(400).json({ error: "New password must be different from current password." });
  }

  next();
}
