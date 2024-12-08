import { WebSocket } from 'ws';
import admin from 'firebase-admin';
import User from '../models/User';

class NotificationService {
  private connections: Map<string, WebSocket>;

  constructor() {
    this.connections = new Map();
  }

  addConnection(userId: string, ws: WebSocket) {
    this.connections.set(userId, ws);

    ws.on('close', () => {
      this.connections.delete(userId);
    });
  }

  async sendNotification(userId: string, notification: {
    type: string;
    title: string;
    message: string;
    data?: any;
  }) {
    try {
      const user = await User.findById(userId);
      if (!user) return;

      // Send WebSocket notification
      const ws = this.connections.get(userId);
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(notification));
      }

      // Send push notification if enabled
      if (user.notificationPreferences.push && user.fcmToken) {
        await admin.messaging().send({
          token: user.fcmToken,
          notification: {
            title: notification.title,
            body: notification.message
          },
          data: notification.data
        });
      }
    } catch (error) {
      console.error('Notification error:', error);
    }
  }

  async sendPaymentReminder(userId: string, groupName: string, amount: number, dueDate: Date) {
    await this.sendNotification(userId, {
      type: 'PAYMENT_REMINDER',
      title: 'Payment Reminder',
      message: `Your payment of $${amount} for ${groupName} is due on ${dueDate.toLocaleDateString()}`,
      data: {
        groupName,
        amount: amount.toString(),
        dueDate: dueDate.toISOString()
      }
    });
  }

  async sendPaymentConfirmation(userId: string, groupName: string, amount: number) {
    await this.sendNotification(userId, {
      type: 'PAYMENT_CONFIRMATION',
      title: 'Payment Confirmed',
      message: `Your payment of $${amount} for ${groupName} has been processed successfully`,
      data: {
        groupName,
        amount: amount.toString()
      }
    });
  }
}

export default new NotificationService();