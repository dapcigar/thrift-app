import { AdminConfig } from '../models/AdminConfig';
import { User } from '../models/User';
import { Group } from '../models/Group';
import { Payment } from '../models/Payment';

export class AdvancedFeeCalculationService {
  async calculateFee({
    amount,
    userId,
    groupId,
    calculationType = 'STANDARD',
    options = {}
  }: {
    amount: number;
    userId: string;
    groupId: string;
    calculationType?: FeeCalculationType;
    options?: any;
  }) {
    const [user, group, config] = await Promise.all([
      User.findById(userId),
      Group.findById(groupId),
      AdminConfig.findOne({ isActive: true })
    ]);

    if (!config) throw new Error('No active fee configuration');

    let feeDetails;
    switch (calculationType) {
      case 'DYNAMIC_TIERED':
        feeDetails = await this.calculateDynamicTieredFee(amount, userId);
        break;
      case 'SEASONAL':
        feeDetails = await this.calculateSeasonalFee(amount, options.season);
        break;
      case 'GROUP_SIZE_BASED':
        feeDetails = await this.calculateGroupSizeFee(amount, group);
        break;
      case 'ACTIVITY_BASED':
        feeDetails = await this.calculateActivityBasedFee(amount, userId);
        break;
      case 'TIME_BASED':
        feeDetails = await this.calculateTimeBasedFee(amount, options.timeOfDay);
        break;
      case 'COMBINED':
        feeDetails = await this.calculateCombinedFee(amount, userId, group, options);
        break;
      default:
        feeDetails = this.calculateStandardFee(amount, config);
    }

    return {
      ...feeDetails,
      finalFee: Math.max(
        config.minimumFee,
        Math.min(config.maximumFee, feeDetails.feeAmount)
      )
    };
  }

  private async calculateDynamicTieredFee(amount: number, userId: string) {
    const userHistory = await this.getUserTransactionHistory(userId);
    const tiers = await this.getDynamicTiers(userHistory.volume);
    const applicableTier = tiers.find(tier => amount <= tier.threshold);

    return {
      feeAmount: (amount * applicableTier.rate) / 100,
      type: 'DYNAMIC_TIERED',
      details: {
        tier: applicableTier.name,
        rate: applicableTier.rate,
        nextTier: this.getNextTier(tiers, amount)
      }
    };
  }

  private async calculateSeasonalFee(amount: number, season: string) {
    const seasonalRates = {
      PEAK: 2.0,
      NORMAL: 1.5,
      OFF_PEAK: 1.0
    };

    return {
      feeAmount: (amount * seasonalRates[season]) / 100,
      type: 'SEASONAL',
      details: {
        season,
        rate: seasonalRates[season]
      }
    };
  }

  private async calculateGroupSizeFee(amount: number, group: any) {
    const baseRate = 1.5;
    const sizeDiscount = Math.min((group.members.length - 5) * 0.1, 0.5);

    return {
      feeAmount: (amount * (baseRate - sizeDiscount)) / 100,
      type: 'GROUP_SIZE_BASED',
      details: {
        groupSize: group.members.length,
        baseRate,
        sizeDiscount
      }
    };
  }

  private async calculateActivityBasedFee(amount: number, userId: string) {
    const activity = await this.getUserActivityMetrics(userId);
    const baseRate = 1.5;
    const activityMultiplier = this.calculateActivityMultiplier(activity);

    return {
      feeAmount: (amount * baseRate * activityMultiplier) / 100,
      type: 'ACTIVITY_BASED',
      details: {
        activityLevel: activity.level,
        multiplier: activityMultiplier,
        metrics: activity
      }
    };
  }

  private async calculateTimeBasedFee(amount: number, timeOfDay: number) {
    const timeRates = {
      EARLY: 1.2,    // 6-10
      NORMAL: 1.5,   // 10-18
      EVENING: 1.3,  // 18-22
      NIGHT: 1.0     // 22-6
    };

    const period = this.getTimePeriod(timeOfDay);

    return {
      feeAmount: (amount * timeRates[period]) / 100,
      type: 'TIME_BASED',
      details: {
        period,
        rate: timeRates[period],
        timeOfDay
      }
    };
  }

  private async calculateCombinedFee(
    amount: number,
    userId: string,
    group: any,
    options: any
  ) {
    const [
      activityFee,
      groupSizeFee,
      seasonalFee
    ] = await Promise.all([
      this.calculateActivityBasedFee(amount, userId),
      this.calculateGroupSizeFee(amount, group),
      this.calculateSeasonalFee(amount, options.season)
    ]);

    const weightedAverage =
      (activityFee.feeAmount * 0.4) +
      (groupSizeFee.feeAmount * 0.3) +
      (seasonalFee.feeAmount * 0.3);

    return {
      feeAmount: weightedAverage,
      type: 'COMBINED',
      details: {
        components: {
          activity: activityFee,
          groupSize: groupSizeFee,
          seasonal: seasonalFee
        },
        weights: {
          activity: 0.4,
          groupSize: 0.3,
          seasonal: 0.3
        }
      }
    };
  }

  private async getUserTransactionHistory(userId: string) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const transactions = await Payment.find({
      userId,
      createdAt: { $gte: thirtyDaysAgo }
    });

    return {
      volume: transactions.reduce((sum, t) => sum + t.amount, 0),
      count: transactions.length,
      frequency: transactions.length / 30
    };
  }

  private async getUserActivityMetrics(userId: string) {
    // Implementation for getting user activity metrics
    return {
      level: 'ACTIVE',
      frequency: 0.8,
      consistency: 0.9,
      volumeScore: 0.75
    };
  }

  private calculateActivityMultiplier(activity: any) {
    // Implementation for calculating activity multiplier
    return 1.0;
  }

  private getTimePeriod(hour: number) {
    if (hour >= 6 && hour < 10) return 'EARLY';
    if (hour >= 10 && hour < 18) return 'NORMAL';
    if (hour >= 18 && hour < 22) return 'EVENING';
    return 'NIGHT';
  }
}

type FeeCalculationType =
  | 'STANDARD'
  | 'DYNAMIC_TIERED'
  | 'SEASONAL'
  | 'GROUP_SIZE_BASED'
  | 'ACTIVITY_BASED'
  | 'TIME_BASED'
  | 'COMBINED';