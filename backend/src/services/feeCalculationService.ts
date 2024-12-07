import { AdminConfig } from '../models/AdminConfig';
import { User } from '../models/User';
import { Group } from '../models/Group';

export class FeeCalculationService {
  async calculateFee({
    amount,
    userId,
    groupId,
    calculationMethod = 'STANDARD'
  }: {
    amount: number;
    userId: string;
    groupId: string;
    calculationMethod?: 'STANDARD' | 'TIERED' | 'VOLUME_BASED' | 'LOYALTY' | 'PROMOTIONAL'
  }) {
    const [config, user, group] = await Promise.all([
      AdminConfig.findOne({ isActive: true }),
      User.findById(userId),
      Group.findById(groupId)
    ]);

    if (!config) throw new Error('No active fee configuration found');

    let feeAmount: number;
    let appliedMethod: string;
    let details: any = {};

    switch (calculationMethod) {
      case 'TIERED':
        const tierResult = await this.calculateTieredFee(amount, config);
        feeAmount = tierResult.feeAmount;
        details = { tier: tierResult.tier, rate: tierResult.rate };
        appliedMethod = 'TIERED';
        break;

      case 'VOLUME_BASED':
        const volumeResult = await this.calculateVolumeBasedFee(amount, userId);
        feeAmount = volumeResult.feeAmount;
        details = { volume: volumeResult.volume, discount: volumeResult.discount };
        appliedMethod = 'VOLUME_BASED';
        break;

      case 'LOYALTY':
        const loyaltyResult = await this.calculateLoyaltyFee(amount, userId, config);
        feeAmount = loyaltyResult.feeAmount;
        details = { loyaltyLevel: loyaltyResult.level, discount: loyaltyResult.discount };
        appliedMethod = 'LOYALTY';
        break;

      case 'PROMOTIONAL':
        const promoResult = await this.calculatePromotionalFee(amount, userId, groupId);
        feeAmount = promoResult.feeAmount;
        details = { promoType: promoResult.type, discount: promoResult.discount };
        appliedMethod = 'PROMOTIONAL';
        break;

      default: // STANDARD
        feeAmount = config.isPercentageBased ?
          (amount * config.serviceFeePercentage) / 100 :
          config.flatFee;
        appliedMethod = config.isPercentageBased ? 'PERCENTAGE' : 'FLAT';
    }

    // Apply minimum and maximum constraints
    feeAmount = Math.max(config.minimumFee, Math.min(config.maximumFee, feeAmount));

    return {
      feeAmount,
      calculationMethod: appliedMethod,
      details,
      baseAmount: amount,
      totalAmount: amount + feeAmount
    };
  }

  private async calculateTieredFee(amount: number, config: any) {
    const tiers = [
      { threshold: 1000, rate: 0.5 },
      { threshold: 5000, rate: 0.75 },
      { threshold: 10000, rate: 1.0 },
      { threshold: 50000, rate: 1.25 },
      { threshold: Infinity, rate: 1.5 }
    ];

    const tier = tiers.find(t => amount <= t.threshold);
    const rate = tier?.rate || tiers[tiers.length - 1].rate;
    const feeAmount = (amount * rate) / 100;

    return { feeAmount, tier: tier?.threshold, rate };
  }

  private async calculateVolumeBasedFee(amount: number, userId: string) {
    // Calculate user's transaction volume in last 30 days
    const volume = await this.getUserTransactionVolume(userId);
    
    let discount = 0;
    if (volume > 10000) discount = 0.3;
    else if (volume > 5000) discount = 0.2;
    else if (volume > 1000) discount = 0.1;

    const baseFee = (amount * 1.5) / 100; // 1.5% base rate
    const feeAmount = baseFee * (1 - discount);

    return { feeAmount, volume, discount };
  }

  private async calculateLoyaltyFee(amount: number, userId: string, config: any) {
    const userHistory = await this.getUserLoyaltyMetrics(userId);
    
    let level = 'BRONZE';
    let discount = 0;

    if (userHistory.monthsActive > 12 && userHistory.successfulPayments > 50) {
      level = 'PLATINUM';
      discount = 0.4;
    } else if (userHistory.monthsActive > 6 && userHistory.successfulPayments > 25) {
      level = 'GOLD';
      discount = 0.25;
    } else if (userHistory.monthsActive > 3 && userHistory.successfulPayments > 10) {
      level = 'SILVER';
      discount = 0.15;
    }

    const baseFee = config.isPercentageBased ?
      (amount * config.serviceFeePercentage) / 100 :
      config.flatFee;

    const feeAmount = baseFee * (1 - discount);

    return { feeAmount, level, discount };
  }

  private async calculatePromotionalFee(amount: number, userId: string, groupId: string) {
    // Check for active promotions
    const promotion = await this.getActivePromotion(userId, groupId);
    
    if (!promotion) {
      return {
        feeAmount: (amount * 1.5) / 100, // Default 1.5%
        type: 'STANDARD',
        discount: 0
      };
    }

    const baseFee = (amount * 1.5) / 100;
    const feeAmount = baseFee * (1 - promotion.discount);

    return {
      feeAmount,
      type: promotion.type,
      discount: promotion.discount
    };
  }

  private async getUserTransactionVolume(userId: string): Promise<number> {
    // Implement transaction volume calculation
    return 0;
  }

  private async getUserLoyaltyMetrics(userId: string) {
    // Implement loyalty metrics calculation
    return { monthsActive: 0, successfulPayments: 0 };
  }

  private async getActivePromotion(userId: string, groupId: string) {
    // Implement promotion lookup
    return null;
  }
}