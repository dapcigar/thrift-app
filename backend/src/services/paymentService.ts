import { Payment } from '../models/Payment';
import { Group } from '../models/Group';
import { NotificationService } from './notificationService';

export class PaymentService {
  constructor(private notificationService: NotificationService) {}

  async recordPayment(userId: string, groupId: string, amount: number) {
    const group = await Group.findById(groupId);
    if (!group) throw new Error('Group not found');

    const payment = new Payment({
      userId,
      groupId,
      amount,
      dueDate: new Date(),
      status: 'PAID',
      paidDate: new Date()
    });

    await payment.save();

    // Check if this completes a payout cycle
    await this.checkAndProcessPayout(group);

    // Notify group coordinator
    await this.notificationService.notifyPaymentReceived(group.coordinator, payment);

    return payment;
  }

  private async checkAndProcessPayout(group: any) {
    const currentPayoutSchedule = group.payoutSchedule[0];
    if (!currentPayoutSchedule) return;

    const allPaymentsMade = await this.checkAllPaymentsMade(group._id);
    if (allPaymentsMade) {
      await this.processPayout(group, currentPayoutSchedule.userId);
      group.payoutSchedule.shift();
      await group.save();
    }
  }

  private async checkAllPaymentsMade(groupId: string): Promise<boolean> {
    const payments = await Payment.find({ groupId });
    return payments.length === group.totalMembers;
  }

  private async processPayout(group: any, userId: string) {
    await this.notificationService.notifyPayoutProcessed(userId, group._id);
  }
}