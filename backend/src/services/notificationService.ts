import { WebSocket } from 'ws';
import { User } from '../models/User';
import { EmailService } from './emailService';

export class NotificationService {
  private connections: Map<string, WebSocket> = new Map();
  private emailService: EmailService;

  constructor() {
    this.emailService = new EmailService();
  }

  async notifyServiceFee(userId: string, feeAmount: number, groupId: string) {
    const user = await User.findById(userId);
    const message = {
      type: 'SERVICE_FEE',
      data: {
        amount: feeAmount,
        groupId
      }
    };

    // Send real-time notification
    const ws = this.connections.get(userId);
    if (ws) {
      ws.send(JSON.stringify(message));
    }

    // Send email notification
    if (user) {
      await this.emailService.sendServiceFeeNotification({
        to: user.email,
        amount: feeAmount,
        userName: `${user.firstName} ${user.lastName}`
      });
    }
  }

  async notifyServiceFeeCollection(adminId: string, totalAmount: number, period: string) {
    const admin = await User.findById(adminId);
    const message = {
      type: 'SERVICE_FEE_COLLECTION',
      data: {
        amount: totalAmount,
        period
      }
    };

    // Send real-time notification
    const ws = this.connections.get(adminId);
    if (ws) {
      ws.send(JSON.stringify(message));
    }

    // Send email notification
    if (admin) {
      await this.emailService.sendServiceFeeCollectionReport({
        to: admin.email,
        amount: totalAmount,
        period,
        adminName: `${admin.firstName} ${admin.lastName}`
      });
    }
  }

  async notifyPaymentWithFee(userId: string, payment: any) {
    const user = await User.findById(userId);
    const message = {
      type: 'PAYMENT_WITH_FEE',
      data: {
        paymentAmount: payment.amount,
        feeAmount: payment.serviceFee.amount,
        totalAmount: payment.amount + payment.serviceFee.amount,
        groupId: payment.groupId
      }
    };

    // Send real-time notification
    const ws = this.connections.get(userId);
    if (ws) {
      ws.send(JSON.stringify(message));
    }

    // Send email notification
    if (user) {
      await this.emailService.sendPaymentWithFeeConfirmation({
        to: user.email,
        userName: `${user.firstName} ${user.lastName}`,
        paymentAmount: payment.amount,
        feeAmount: payment.serviceFee.amount,
        totalAmount: payment.amount + payment.serviceFee.amount
      });
    }
  }
}