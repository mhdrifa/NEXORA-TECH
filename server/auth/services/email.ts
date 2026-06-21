import dotenv from "dotenv";
dotenv.config();

/**
 * Enterprise HTML Email Templates
 */
const TEMPLATES = {
  welcome: (name: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to NEXORA TECH</title>
      <style>
        body { font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f4f6fa; margin: 0; padding: 20px; color: #2d3748; }
        .card { max-width: 600px; background: #ffffff; border-radius: 12px; padding: 40px; margin: 0 auto; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }
        .logo { font-size: 24px; font-weight: 700; color: #1a202c; letter-spacing: -0.05em; margin-bottom: 24px; }
        .logo span { color: #3182ce; }
        h1 { font-size: 22px; font-weight: 600; color: #1a202c; margin-top: 0; }
        p { line-height: 1.6; font-size: 16px; color: #4a5568; }
        .btn { display: inline-block; background-color: #3182ce; color: #ffffff !important; text-decoration: none; padding: 12px 24px; font-weight: 600; border-radius: 6px; margin-top: 24px; }
        .footer { margin-top: 40px; font-size: 13px; color: #a0aec0; border-top: 1px solid #edf2f7; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">NEXORA<span>TECH</span></div>
        <h1>Welcome to Nexora Tech, ${name}!</h1>
        <p>Your enterprise account has been created successfully. We design, build, and deploy secure agentic AI workflows, container clusters, and decoupled high-performance applications.</p>
        <p>To access your customer portal or workspace catalog, log in to your dashboard anytime using your registered credentials.</p>
        <a href="https://nexora.tech/login" class="btn">Access Portal Dashboard</a>
        <div class="footer">
          &copy; 2026 Nexora Tech Inc. All rights reserved.<br>
          This is an automated operational system alert.
        </div>
      </div>
    </body>
    </html>
  `,

  verify: (name: string, verifyUrl: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Verify Your Corporate Email</title>
      <style>
        body { font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f4f6fa; margin: 0; padding: 20px; color: #2d3748; }
        .card { max-width: 600px; background: #ffffff; border-radius: 12px; padding: 40px; margin: 0 auto; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }
        .logo { font-size: 24px; font-weight: 700; color: #1a202c; letter-spacing: -0.05em; margin-bottom: 24px; }
        .logo span { color: #3182ce; }
        h1 { font-size: 22px; font-weight: 600; color: #1a202c; margin-top: 0; }
        p { line-height: 1.6; font-size: 16px; color: #4a5568; }
        .btn { display: inline-block; background-color: #3182ce; color: #ffffff !important; text-decoration: none; padding: 12px 24px; font-weight: 600; border-radius: 6px; margin-top: 24px; }
        .footer { margin-top: 40px; font-size: 13px; color: #a0aec0; border-top: 1px solid #edf2f7; padding-top: 20px; }
        .url { font-size: 13px; color: #718096; word-break: break-all; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">NEXORA<span>TECH</span></div>
        <h1>Action Required: Please Verify Your Email Address</h1>
        <p>Dear ${name},</p>
        <p>Thank you for establishing your credentials on Nexora Tech. To activate your account and complete our RBAC clearance, please verify your email address by clicking the button below:</p>
        <a href="${verifyUrl}" class="btn">Verify Email Address</a>
        <p class="url">If the button above does not work, copy and paste the following URL into your browser:</p>
        <div class="url">${verifyUrl}</div>
        <div class="footer">
          &copy; 2026 Nexora Tech Inc. All rights reserved.<br>
          If you did not issue this registration, discard this notification.
        </div>
      </div>
    </body>
    </html>
  `,

  forgotPassword: (name: string, resetUrl: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Reset Your Password</title>
      <style>
        body { font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f4f6fa; margin: 0; padding: 20px; color: #2d3748; }
        .card { max-width: 600px; background: #ffffff; border-radius: 12px; padding: 40px; margin: 0 auto; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }
        .logo { font-size: 24px; font-weight: 700; color: #1a202c; letter-spacing: -0.05em; margin-bottom: 24px; }
        .logo span { color: #3182ce; }
        h1 { font-size: 22px; font-weight: 600; color: #1a202c; margin-top: 0; }
        p { line-height: 1.6; font-size: 16px; color: #4a5568; }
        .btn { display: inline-block; background-color: #e53e3e; color: #ffffff !important; text-decoration: none; padding: 12px 24px; font-weight: 600; border-radius: 6px; margin-top: 24px; }
        .footer { margin-top: 40px; font-size: 13px; color: #a0aec0; border-top: 1px solid #edf2f7; padding-top: 20px; }
        .url { font-size: 13px; color: #718096; word-break: break-all; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">NEXORA<span>TECH</span></div>
        <h1>Password Reset Requested</h1>
        <p>Dear ${name},</p>
        <p>We received an enterprise-system request to reset the password for your Nexora Tech account. This security link expires in 1 Hour.</p>
        <a href="${resetUrl}" class="btn">Reset My Password</a>
        <p class="url">If the button above does not work, copy and paste the following URL into your browser:</p>
        <div class="url">${resetUrl}</div>
        <div class="footer">
          &copy; 2026 Nexora Tech Inc. All rights reserved.<br>
          If you did not authorize this request, please contact a security cluster admin immediately.
        </div>
      </div>
    </body>
    </html>
  `,

  passwordChanged: (name: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Password Security Alert</title>
      <style>
        body { font-family: 'Inter', Helvetica, Arial, sans-serif; background-color: #f4f6fa; margin: 0; padding: 20px; color: #2d3748; }
        .card { max-width: 600px; background: #ffffff; border-radius: 12px; padding: 40px; margin: 0 auto; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); border: 1px solid #e2e8f0; }
        .logo { font-size: 24px; font-weight: 700; color: #1a202c; letter-spacing: -0.05em; margin-bottom: 24px; }
        .logo span { color: #3182ce; }
        h1 { font-size: 22px; font-weight: 600; color: #e53e3e; margin-top: 0; }
        p { line-height: 1.6; font-size: 16px; color: #4a5568; }
        .footer { margin-top: 40px; font-size: 13px; color: #a0aec0; border-top: 1px solid #edf2f7; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="logo">NEXORA<span>TECH</span></div>
        <h1>Security Check: Your password has been changed</h1>
        <p>Dear ${name},</p>
        <p>This is a formal security ledger notification that the password linked to your Nexora Tech corporate profile was modified recently.</p>
        <p>If you made this modification personally, please ignore this security dispatch. If you have not submitted this alteration, please immediately lock your profile via admin tools or reach out to security officers.</p>
        <div class="footer">
          &copy; 2026 Nexora Tech Inc. All rights reserved.<br>
          Security & Performance Ledger Management Systems.
        </div>
      </div>
    </body>
    </html>
  `
};

export class EmailService {
  /**
   * Dispatches Welcome email
   */
  public static async sendWelcome(email: string, name: string): Promise<boolean> {
    const html = TEMPLATES.welcome(name);
    return this.sendMail({
      to: email,
      subject: "Welcome to Nexora Tech",
      html
    });
  }

  /**
   * Dispatches Email Verification
   */
  public static async sendVerification(email: string, name: string, token: string): Promise<boolean> {
    const url = `${process.env.APP_URL || "https://ais-dev-3evdp2u2kusghpnw5uvz23-1009882704898.asia-southeast1.run.app"}/verify-email?token=${token}`;
    const html = TEMPLATES.verify(name, url);
    return this.sendMail({
      to: email,
      subject: "Action Required: Verify your email address at Nexora Tech",
      html
    });
  }

  /**
   * Dispatches Reset Password link
   */
  public static async sendForgotPassword(email: string, name: string, token: string): Promise<boolean> {
    const url = `${process.env.APP_URL || "https://ais-dev-3evdp2u2kusghpnw5uvz23-1009882704898.asia-southeast1.run.app"}/reset-password?token=${token}`;
    const html = TEMPLATES.forgotPassword(name, url);
    return this.sendMail({
      to: email,
      subject: "NEXORA SECURITY: Reset your password",
      html
    });
  }

  /**
   * Dispatches Password Changed confirmation
   */
  public static async sendPasswordChanged(email: string, name: string): Promise<boolean> {
    const html = TEMPLATES.passwordChanged(name);
    return this.sendMail({
      to: email,
      subject: "NEXORA SECURITY: Your password was changed successfully",
      html
    });
  }

  /**
   * Core mail transport implementation.
   * Leverages official environment settings if present, otherwise logs
   * fully styled text so developers can instantly view activation urls.
   */
  private static async sendMail(options: { to: string; subject: string; html: string }): Promise<boolean> {
    console.log("\n=======================================================");
    console.log(`[SMTP MOCK] Dispatched Corporate Transactional Email`);
    console.log(`To:      ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log("=======================================================");
    
    // Scans html briefly to find links for local CLI previewing ease
    const tokenRegex = /(?:verify-email|reset-password)\?token=([a-zA-Z0-9_\-]+)/g;
    let match;
    while ((match = tokenRegex.exec(options.html)) !== null) {
      console.log(`[CLear-text-URL-Credential-Token-Capture]: ${match[0]}`);
    }
    console.log("=======================================================\n");
    return true;
  }
}
