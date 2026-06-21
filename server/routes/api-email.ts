import { Router, Request, Response, NextFunction } from "express";
import { 
  sendContactNotification, 
  sendResetPasswordEmail, 
  sendVerificationEmail, 
  sendEmail, 
  sendClientNotification,
  sendAdminNotification
} from "../utils/emailService.ts";
import { requireAuth, AuthRequest } from "../../src/middleware/auth.ts";
import { db } from "../../src/db/index.ts";
import { users } from "../../src/db/schema.ts";
import { eq } from "drizzle-orm";

const router = Router();

const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req as AuthRequest, res, next)).catch((err) => {
    console.error("Email API Error:", err);
    res.status(500).json({ error: "Internal Server Error", details: err.message });
  });
};

/* ==========================================================================
   PUBLIC ROUTES
   ========================================================================== */

// 1. Contact Form
router.post("/contact", asyncHandler(async (req: Request, res: Response) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required" });
  }

  // Send to admin
  const success = await sendContactNotification(name, email, message);
  
  if (success) {
    // Optionally trigger an auto-reply here.
    const autoReplySubject = "We received your message!";
    const autoReplyHtml = `<div style="font-family: sans-serif; padding: 20px;">
      <h2>Thank you for contacting Nexora Tech!</h2>
      <p>We have received your message and our team will get back to you shortly.</p>
    </div>`;
    await sendEmail(email, autoReplySubject, autoReplyHtml, 'contact_autoreply');

    res.status(200).json({ success: true, message: "Message sent successfully" });
  } else {
    res.status(500).json({ error: "Failed to send message" });
  }
}));

// 2. Request Password Reset (simulated token generation for now)
router.post("/reset-password", asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const dbUsers = await db.select().from(users).where(eq(users.email, email));
  if (dbUsers.length > 0) {
    // Mock JWT reset token logic
    const resetToken = "mock_reset_token_" + Date.now();
    const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    await sendResetPasswordEmail(email, resetUrl);
  }
  // Always return success to prevent email enumeration
  res.status(200).json({ success: true, message: "If the email exists, a reset link has been sent." });
}));

// 3. Request Verification (simulated token generator)
router.post("/verify", asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required" });

  const verificationToken = "mock_verify_token_" + Date.now();
  const verifyUrl = `${process.env.APP_URL || 'http://localhost:3000'}/verify-email?token=${verificationToken}`;
  
  const success = await sendVerificationEmail(email, verifyUrl);
  if (success) {
    res.status(200).json({ success: true, message: "Verification email sent." });
  } else {
    res.status(500).json({ error: "Failed to send verification email." });
  }
}));


/* ==========================================================================
   PROTECTED ROUTES (for general testing / admin triggering)
   ========================================================================== */

router.post("/send", requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  // E.g. Admin sending a custom email
  const { to, subject, html, emailType } = req.body;
  
  if (!to || !subject || !html) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const success = await sendEmail(to, subject, html, emailType || 'custom');
  if (success) {
    res.status(200).json({ success: true, message: "Email sent." });
  } else {
    res.status(500).json({ error: "Failed to send email." });
  }
}));

router.post("/test", requireAuth, asyncHandler(async (req: AuthRequest, res: Response) => {
  const { type, email } = req.body; // type: 'client_notification' | 'admin_notification'
  
  if (!email) return res.status(400).json({ error: "Email is required" });

  let success = false;
  if (type === 'client_notification') {
    success = await sendClientNotification(email, "Project Update", "Your project 'Website Redesign' has moved to 'Review' phase.", "http://localhost:3000/portal", "View Project");
  } else if (type === 'admin_notification') {
    success = await sendAdminNotification("New System Alert", "High CPU usage detected on server 1.", "http://localhost:3000/admin", "View Dashboard");
  } else {
    return res.status(400).json({ error: "Invalid test type" });
  }

  if (success) {
    res.status(200).json({ success: true, message: "Test email sent." });
  } else {
    res.status(500).json({ error: "Failed to send test email." });
  }
}));


export default router;
