import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendWelcomeEmail = async (email: string, firstName: string) => {
  const html = `
    <h2>Welcome to ThriftApp!</h2>
    <p>Hello ${firstName},</p>
    <p>Thank you for joining ThriftApp. We're excited to help you manage your savings groups.</p>
    <p>Get started by:</p>
    <ul>
      <li>Creating a new savings group</li>
      <li>Joining an existing group</li>
      <li>Setting up your profile</li>
    </ul>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Welcome to ThriftApp',
    html
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
  
  const html = `
    <h2>Reset Your Password</h2>
    <p>You requested to reset your password. Click the button below to proceed:</p>
    <p>
      <a href="${resetUrl}" style="background: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">
        Reset Password
      </a>
    </p>
    <p>If you didn't request this, please ignore this email.</p>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Password Reset Request',
    html
  });
};

export const sendPasswordChangeConfirmation = async (email: string) => {
  const html = `
    <h2>Password Changed</h2>
    <p>Your password has been successfully changed.</p>
    <p>If you didn't make this change, please contact support immediately.</p>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Password Changed Successfully',
    html
  });
};

export const sendPaymentReminder = async (email: string, groupName: string, amount: number, dueDate: Date) => {
  const html = `
    <h2>Payment Reminder</h2>
    <p>This is a friendly reminder about your upcoming payment:</p>
    <ul>
      <li>Group: ${groupName}</li>
      <li>Amount: $${amount}</li>
      <li>Due Date: ${dueDate.toLocaleDateString()}</li>
    </ul>
    <p>Please ensure your payment is made on time to avoid any delays in the group's schedule.</p>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: `Payment Reminder for ${groupName}`,
    html
  });
};

export const sendPayoutNotification = async (email: string, groupName: string, amount: number) => {
  const html = `
    <h2>Payout Notification</h2>
    <p>Great news! Your payout has been processed:</p>
    <ul>
      <li>Group: ${groupName}</li>
      <li>Amount: $${amount}</li>
    </ul>
    <p>The funds should be available in your account within 1-2 business days.</p>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: `Payout Processed for ${groupName}`,
    html
  });
};