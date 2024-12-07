import { Payment } from '../models/Payment';
import { Group } from '../models/Group';
import { NotificationService } from './notificationService';
import { AdminFeeService } from './adminFeeService';

export class PaymentService {
  constructor(
    private notificationService: NotificationService,
    private adminFeeService: AdminFeeService
  ) {}

  async recordPayment(userId: string, groupId: string, amount: number) {
    const group = await Group.findById(groupId);
    if (!group) throw new Error('Group not found');

    // Calculate service fee
    const { feeAmount, calculationMethod, feePercentage } = 
      await this.adminFeeService.calculateFee(amount);

    // Create payment record
    const payment = new Payment({
      userId,
      groupId,
      amount,
      dueDate: new Date(),
      status: 'PAID',
      paidDate: new Date()
    });

    await payment.save();

    // Record service fee
    await this.adminFeeService.processServiceFee(payment);

    // Update total amount to include service fee
    const totalAmount = amount + feeAmount;

    // Process the payment with total amount
    // Add your payment processing logic here (e.g., Stripe)

    // Notify relevant parties
    await this.notificationService.notifyPaymentReceived(
      group.coordinator.toString(),
      payment
    );

    await this.notificationService.notifyServiceFee(
      userId,
      feeAmount,
      groupId
    );

    // Check if this completes a payout cycle
    await this.checkAndProcessPayout(group);

    return {
      payment,
      serviceFee: {
        amount: feeAmount,
        calculationMethod,
        percentage: feePercentage
      }
    };
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
    // Add your payout processing logic here
    await this.notificationService.notifyPayoutProcessed(userId, group._id);
  }
}