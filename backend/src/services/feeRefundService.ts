import { ServiceFee } from '../models/ServiceFee';
import { User } from '../models/User';
import { NotificationService } from './notificationService';
import { EmailService } from './emailService';

export enum RefundReason {
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  OVERCHARGE = 'OVERCHARGE',
  CUSTOMER_REQUEST = 'CUSTOMER_REQUEST',
  LOYALTY_ADJUSTMENT = 'LOYALTY_ADJUSTMENT',
  PROMOTIONAL_CREDIT = 'PROMOTIONAL_CREDIT'
}

export class FeeRefundService {
  constructor(
    private notificationService: NotificationService,
    private emailService: EmailService
  ) {}

  async processRefund({
    feeId,
    amount,
    reason,
    adminId,
    notes
  }: {
    feeId: string;
    amount: number;
    reason: RefundReason;
    adminId: string;
    notes?: string;
  }) {
    const serviceFee = await ServiceFee.findById(feeId);
    if (!serviceFee) {
      throw new Error('Service fee not found');
    }

    if (amount > serviceFee.feeAmount) {
      throw new Error('Refund amount cannot exceed original fee amount');
    }

    // Create refund record
    const refund = await this.createRefundRecord({
      serviceFee,
      amount,
      reason,
      adminId,
      notes
    });

    // Process the actual refund
    await this.executeRefund(refund);

    // Update service fee record
    serviceFee.refundedAmount = (serviceFee.refundedAmount || 0) + amount;
    serviceFee.status = this.determineNewStatus(serviceFee);
    await serviceFee.save();

    // Notify user
    await this.notifyUser(serviceFee.userId, refund);

    return refund;
  }

  async processAdjustment({
    feeId,
    adjustmentAmount,
    reason,
    adminId,
    notes
  }: {
    feeId: string;
    adjustmentAmount: number;
    reason: string;
    adminId: string;
    notes?: string;
  }) {
    const serviceFee = await ServiceFee.findById(feeId);
    if (!serviceFee) {
      throw new Error('Service fee not found');
    }

    const adjustment = await this.createAdjustmentRecord({
      serviceFee,
      amount: adjustmentAmount,
      reason,
      adminId,
      notes
    });

    // Update service fee amount
    serviceFee.feeAmount += adjustmentAmount;
    if (serviceFee.feeAmount < 0) {
      throw new Error('Adjustment would result in negative fee amount');
    }

    await serviceFee.save();

    // Notify user
    await this.notifyUser(serviceFee.userId, adjustment);

    return adjustment;
  }

  async getBulkRefundCandidates(criteria: {
    startDate: Date;
    endDate: Date;
    minAmount?: number;
    reason?: RefundReason;
  }) {
    return await ServiceFee.find({
      createdAt: { $gte: criteria.startDate, $lte: criteria.endDate },
      feeAmount: { $gte: criteria.minAmount || 0 },
      status: 'PAID',
      refundedAmount: { $exists: false }
    }).populate('userId');
  }

  async processBulkRefund({
    feeIds,
    reason,
    adminId,
    refundPercentage = 100
  }: {
    feeIds: string[];
    reason: RefundReason;
    adminId: string;
    refundPercentage?: number;
  }) {
    const refunds = [];

    for (const feeId of feeIds) {
      const serviceFee = await ServiceFee.findById(feeId);
      if (!serviceFee || serviceFee.status !== 'PAID') continue;

      const refundAmount = (serviceFee.feeAmount * refundPercentage) / 100;
      try {
        const refund = await this.processRefund({
          feeId,
          amount: refundAmount,
          reason,
          adminId,
          notes: 'Bulk refund processing'
        });
        refunds.push(refund);
      } catch (error) {
        console.error(`Failed to process refund for fee ${feeId}:`, error);
      }
    }

    return refunds;
  }

  private async createRefundRecord(data: any) {
    // Implement refund record creation
    return null;
  }

  private async executeRefund(refund: any) {
    // Implement actual refund processing logic
    // This could involve payment gateway integration
    return null;
  }

  private determineNewStatus(serviceFee: any) {
    const fullyRefunded = serviceFee.refundedAmount >= serviceFee.feeAmount;
    return fullyRefunded ? 'REFUNDED' : 'PARTIALLY_REFUNDED';
  }

  private async notifyUser(userId: string, refundOrAdjustment: any) {
    const user = await User.findById(userId);
    if (!user) return;

    // Send notification
    await this.notificationService.notifyFeeRefund(
      userId,
      refundOrAdjustment
    );

    // Send email
    await this.emailService.sendRefundNotification({
      to: user.email,
      userName: `${user.firstName} ${user.lastName}`,
      amount: refundOrAdjustment.amount,
      reason: refundOrAdjustment.reason
    });
  }
}