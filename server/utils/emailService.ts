import nodemailer from 'nodemailer';
import { db } from '../../src/db/index.ts';
import { emailLogs } from '../../src/db/schema.ts';
import { 
  getWelcomeTemplate, 
  getPasswordResetTemplate, 
  getVerificationTemplate, 
  getContactTemplate, 
  getNotificationTemplate 
} from './emailTemplates.ts';

// Nodemailer config
const sgApiKey = process.env.SENDGRID_API_KEY;

// If SendGrid API key exists, use it. Otherwise, use mock/fallback nodemailer setup (Ethereal or just mock logging).
let transporter: nodemailer.Transporter;

if (sgApiKey) {
  transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
      user: 'apikey',
      pass: sgApiKey,
    },
  });
} else {
  // Mock / Fallback transport for development
  transporter = nodemailer.createTransport({
    streamTransport: true,
    newline: 'windows'
  });
}

const FROM_EMAIL = process.env.SYSTEM_FROM_EMAIL || 'noreply@nexoratech.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@nexoratech.com';

export const sendEmail = async (to: string, subject: string, html: string, emailType: string) => {
  try {
    const info = await transporter.sendMail({
      from: `"Nexora Tech" <${FROM_EMAIL}>`,
      to,
      subject,
      html
    });

    console.log(`Email sent [${emailType}] to ${to}. messageId: ${info.messageId}`);
    
    // Log success
    await db.insert(emailLogs).values({
      recipientEmail: to,
      subject,
      emailType,
      status: 'sent',
      sentAt: new Date()
    });

    return true;
  } catch (error: any) {
    console.error('Email sending failed:', error);
    
    // Log failure
    await db.insert(emailLogs).values({
      recipientEmail: to,
      subject,
      emailType,
      status: 'failed',
      errorMessage: error.message || 'Unknown error'
    });
    
    return false;
  }
};

export const sendWelcomeEmail = async (to: string, name: string, loginUrl: string) => {
  const subject = "Welcome to Nexora Tech!";
  const html = getWelcomeTemplate(name, loginUrl);
  return sendEmail(to, subject, html, 'welcome');
};

export const sendResetPasswordEmail = async (to: string, resetUrl: string) => {
  const subject = "Reset Your Password - Nexora Tech";
  const html = getPasswordResetTemplate(resetUrl);
  return sendEmail(to, subject, html, 'password_reset');
};

export const sendVerificationEmail = async (to: string, verificationUrl: string) => {
  const subject = "Verify Your Email - Nexora Tech";
  const html = getVerificationTemplate(verificationUrl);
  return sendEmail(to, subject, html, 'email_verify');
};

export const sendContactNotification = async (name: string, email: string, message: string) => {
  const subject = `New Contact Form Submission: ${name}`;
  const html = getContactTemplate(name, email, message);
  return sendEmail(ADMIN_EMAIL, subject, html, 'contact_notification');
};

export const sendClientNotification = async (to: string, title: string, message: string, actionUrl?: string, actionText?: string) => {
  const subject = `Update: ${title}`;
  const html = getNotificationTemplate(title, message, actionUrl, actionText);
  return sendEmail(to, subject, html, 'client_notification');
};

export const sendAdminNotification = async (title: string, message: string, actionUrl?: string, actionText?: string) => {
  const subject = `Admin Alert: ${title}`;
  const html = getNotificationTemplate(title, message, actionUrl, actionText);
  return sendEmail(ADMIN_EMAIL, subject, html, 'admin_notification');
};
