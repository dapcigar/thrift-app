import nodemailer from 'nodemailer';
import { formatCurrency } from '../utils/helpers';

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  async sendServiceFeeNotification({
    to,
    amount,
    userName
  }: {
    to: string;
    amount: number;
    userName: string;
  }) {
    const html = `
      <h2>Service Fee Notification</h2>
      <p>Hello ${userName},</p>
      <p>A service fee of ${formatCurrency(amount)} has been charged for your recent transaction.</p>
      <p>This fee helps us maintain and improve our platform services.</p>
      <p>If you have any questions about this fee, please don't hesitate to contact our support team.</p>
    `;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: 'Service Fee Notification',
      html
    });
  }

  async sendServiceFeeCollectionReport({
    to,
    amount,
    period,
    adminName
  }: {
    to: string;
    amount: number;
    period: string;
    adminName: string;
  }) {
    const html = `
      <h2>Service Fee Collection Report</h2>
      <p>Hello ${adminName},</p>
      <p>Here's your service fee collection report for ${period}:</p>
      <p>Total Amount Collected: ${formatCurrency(amount)}</p>
      <p>You can view detailed analytics in your admin dashboard.</p>
    `;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: `Service Fee Report - ${period}`,
      html
    });
  }

  async sendPaymentWithFeeConfirmation({
    to,
    userName,
    paymentAmount,
    feeAmount,
    totalAmount
  }: {
    to: string;
    userName: string;
    paymentAmount: number;
    feeAmount: number;
    totalAmount: number;
  }) {
    const html = `
      <h2>Payment Confirmation</h2>
      <p>Hello ${userName},</p>
      <p>Your payment has been processed successfully:</p>
      <ul>
        <li>Contribution Amount: ${formatCurrency(paymentAmount)}</li>
        <li>Service Fee: ${formatCurrency(feeAmount)}</li>
        <li>Total Amount: ${formatCurrency(totalAmount)}</li>
      </ul>
      <p>Thank you for using our platform!</p>
    `;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: 'Payment Confirmation',
      html
    });
  }
}