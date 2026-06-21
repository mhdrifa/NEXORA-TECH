export const getWelcomeTemplate = (name: string, loginUrl: string) => `
<div style="font-family: 'Inter', sans-serif; max-w-[600px] margin: 0 auto; color: #333; padding: 20px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <h1 style="color: #0066FF;">NEXORA TECH</h1>
  </div>
  <div style="background-color: #f8fafc; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0;">
    <h2 style="margin-top: 0;">Welcome, ${name}!</h2>
    <p>We're thrilled to have you join Nexora Tech. Your account has been successfully created.</p>
    <p>You can now log in to the Client Portal to manage your projects, invoices, and support tickets.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${loginUrl}" style="background-color: #0066FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Log In to Portal</a>
    </div>
    <p style="color: #64748b; font-size: 14px;">If you have any questions, reply to this email or reach out to our support team.</p>
  </div>
</div>
`;

export const getPasswordResetTemplate = (resetUrl: string) => `
<div style="font-family: 'Inter', sans-serif; max-w-[600px] margin: 0 auto; color: #333; padding: 20px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <h1 style="color: #0066FF;">NEXORA TECH</h1>
  </div>
  <div style="background-color: #f8fafc; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0;">
    <h2 style="margin-top: 0;">Password Reset Request</h2>
    <p>We received a request to reset your password for your Nexora Tech account.</p>
    <p>Click the button below to choose a new password. This link will expire in 30 minutes.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="background-color: #0066FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Reset Password</a>
    </div>
    <p style="color: #64748b; font-size: 14px;">If you did not request this, please ignore this email or contact support if you have concerns.</p>
  </div>
</div>
`;

export const getVerificationTemplate = (verificationUrl: string) => `
<div style="font-family: 'Inter', sans-serif; max-w-[600px] margin: 0 auto; color: #333; padding: 20px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <h1 style="color: #0066FF;">NEXORA TECH</h1>
  </div>
  <div style="background-color: #f8fafc; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0;">
    <h2 style="margin-top: 0;">Verify Your Email</h2>
    <p>Please click the button below to verify your email address and activate your account.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${verificationUrl}" style="background-color: #0066FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Verify Email Address</a>
    </div>
  </div>
</div>
`;

export const getContactTemplate = (name: string, email: string, message: string) => `
<div style="font-family: 'Inter', sans-serif; max-w-[600px] margin: 0 auto; color: #333; padding: 20px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <h1 style="color: #0066FF;">NEXORA TECH</h1>
  </div>
  <div style="background-color: #f8fafc; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0;">
    <h2 style="margin-top: 0;">New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <div style="margin-top: 20px; padding: 15px; background-color: white; border: 1px solid #e2e8f0; border-radius: 6px;">
      <p style="margin: 0; white-space: pre-wrap;">${message}</p>
    </div>
  </div>
</div>
`;

export const getNotificationTemplate = (title: string, message: string, actionUrl?: string, actionText?: string) => `
<div style="font-family: 'Inter', sans-serif; max-w-[600px] margin: 0 auto; color: #333; padding: 20px;">
  <div style="text-align: center; margin-bottom: 20px;">
    <h1 style="color: #0066FF;">NEXORA TECH</h1>
  </div>
  <div style="background-color: #f8fafc; padding: 30px; border-radius: 12px; border: 1px solid #e2e8f0;">
    <h2 style="margin-top: 0;">${title}</h2>
    <p style="white-space: pre-wrap;">${message}</p>
    ${actionUrl ? `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${actionUrl}" style="background-color: #0066FF; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">${actionText || "View Details"}</a>
    </div>
    ` : ''}
  </div>
</div>
`;
