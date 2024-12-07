import { WebSocket } from 'ws';
import { User } from '../models/User';
import { Notification } from '../models/Notification';

export class NotificationService {
  private connections: Map<string, WebSocket> = new Map();

  addConnection(userId: string, ws: WebSocket) {
    this.connections.set(userId, ws);
  }

  removeConnection(userId: string) {
    this.connections.delete(userId);
  }

  async notifyPaymentReceived(userId: string, payment: any) {
    const ws = this.connections.get(userId);
    if (ws) {
      ws.send(JSON.stringify({
        type: 'PAYMENT_RECEIVED',
        data: payment
      }));
    }
  }

  async notifyPayoutProcessed(userId: string, groupId: string) {
    const ws = this.connections.get(userId);
    if (ws) {
      ws.send(JSON.stringify({
        type: 'PAYOUT_PROCESSED',
        data: { groupId }
      }));
    }
  }
}