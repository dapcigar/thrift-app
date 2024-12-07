import { AdminConfig, IAdminConfig } from '../models/AdminConfig';
import { ServiceFee, IServiceFee } from '../models/ServiceFee';
import { Payment } from '../models/Payment';
import { NotificationService } from './notificationService';

export class AdminFeeService {
  constructor(private notificationService: NotificationService) {}

  async updateFeeConfig(config: Partial<IAdminConfig>, adminId: string): Promise<IAdminConfig> {
    // Deactivate current active config
    await AdminConfig.updateMany(
      { isActive: true },
      { isActive: false }
    );

    // Create new active config
    const newConfig = new AdminConfig({
      ...config,
      lastUpdatedBy: adminId,
      isActive: true
    });

    await newConfig.save();
    return newConfig;
  }

  async calculateFee(amount: number): Promise<{
    feeAmount: number;
    calculationMethod: 'PERCENTAGE' | 'FLAT';
    feePercentage: number;
  }> {
    const config = await AdminConfig.findOne({ isActive: true });
    if (!config) {
      throw new Error('No active admin fee configuration found');
    }

    let feeAmount: number;
    const calculationMethod = config.isPercentageBased ? 'PERCENTAGE' : 'FLAT';

    if (config.isPercentageBased) {
      feeAmount = (amount * config.serviceFeePercentage) / 100;
    } else {
      feeAmount = config.flatFee;
    }

    // Apply minimum and maximum constraints
    feeAmount = Math.max(config.minimumFee, Math.min(config.maximumFee, feeAmount));

    return {
      feeAmount,
      calculationMethod,
      feePercentage: config.serviceFeePercentage
    };
  }

  async processServiceFee(payment: any): Promise<IServiceFee> {
    const { feeAmount, calculationMethod, feePercentage } = await this.calculateFee(payment.amount);

    const serviceFee = new ServiceFee({
      userId: payment.userId,
      groupId: payment.groupId,
      paymentId: payment._id,
      amount: payment.amount,
      feeAmount,
      feePercentage,
      calculationMethod,
      chargeDate: new Date(),
      status: 'PENDING'
    });

    await serviceFee.save();

    // Notify user about service fee
    await this.notificationService.notifyServiceFee(
      payment.userId,
      feeAmount,
      payment.groupId
    );

    return serviceFee;
  }

  async getFeeStatistics(startDate: Date, endDate: Date) {
    const stats = await ServiceFee.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: 'PAID'
        }
      },
      {
        $group: {
          _id: null,
          totalFees: { $sum: '$feeAmount' },
          totalTransactions: { $sum: 1 },
          averageFee: { $avg: '$feeAmount' },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    return stats[0] || {
      totalFees: 0,
      totalTransactions: 0,
      averageFee: 0,
      totalAmount: 0
    };
  }
}