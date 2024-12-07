import { ServiceFee } from '../models/ServiceFee';
import { Group } from '../models/Group';
import { User } from '../models/User';

export class FeeAnalyticsService {
  async getDetailedAnalytics(startDate: Date, endDate: Date) {
    const [feeStats, userStats, groupStats, trendData] = await Promise.all([
      this.getFeeStatistics(startDate, endDate),
      this.getUserAnalytics(startDate, endDate),
      this.getGroupAnalytics(startDate, endDate),
      this.getTrendAnalytics(startDate, endDate)
    ]);

    return {
      feeStats,
      userStats,
      groupStats,
      trendData
    };
  }

  private async getFeeStatistics(startDate: Date, endDate: Date) {
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
          maxFee: { $max: '$feeAmount' },
          minFee: { $min: '$feeAmount' },
          percentageFees: {
            $sum: { $cond: [{ $eq: ['$calculationMethod', 'PERCENTAGE'] }, 1, 0] }
          },
          flatFees: {
            $sum: { $cond: [{ $eq: ['$calculationMethod', 'FLAT'] }, 1, 0] }
          }
        }
      }
    ]);

    return stats[0] || {
      totalFees: 0,
      totalTransactions: 0,
      averageFee: 0,
      maxFee: 0,
      minFee: 0,
      percentageFees: 0,
      flatFees: 0
    };
  }

  private async getUserAnalytics(startDate: Date, endDate: Date) {
    return await ServiceFee.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: 'PAID'
        }
      },
      {
        $group: {
          _id: '$userId',
          totalFees: { $sum: '$feeAmount' },
          transactionCount: { $sum: 1 },
          averageFee: { $avg: '$feeAmount' }
        }
      },
      {
        $sort: { totalFees: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      }
    ]);
  }

  private async getGroupAnalytics(startDate: Date, endDate: Date) {
    return await ServiceFee.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: 'PAID'
        }
      },
      {
        $group: {
          _id: '$groupId',
          totalFees: { $sum: '$feeAmount' },
          transactionCount: { $sum: 1 },
          averageFee: { $avg: '$feeAmount' }
        }
      },
      {
        $sort: { totalFees: -1 }
      },
      {
        $limit: 10
      },
      {
        $lookup: {
          from: 'groups',
          localField: '_id',
          foreignField: '_id',
          as: 'group'
        }
      }
    ]);
  }

  private async getTrendAnalytics(startDate: Date, endDate: Date) {
    return await ServiceFee.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate },
          status: 'PAID'
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          totalFees: { $sum: '$feeAmount' },
          transactionCount: { $sum: 1 },
          averageFee: { $avg: '$feeAmount' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);
  }

  async getProjectedRevenue(days: number = 30) {
    const pastData = await ServiceFee.aggregate([
      {
        $match: {
          status: 'PAID',
          createdAt: {
            $gte: new Date(Date.now() - (days * 2 * 24 * 60 * 60 * 1000))
          }
        }
      },
      {
        $group: {
          _id: null,
          avgDailyRevenue: { $avg: '$feeAmount' },
          growthRate: {
            $avg: {
              $divide: [
                { $subtract: ['$feeAmount', '$avgDailyRevenue'] },
                '$avgDailyRevenue'
              ]
            }
          }
        }
      }
    ]);

    const { avgDailyRevenue, growthRate } = pastData[0] || { avgDailyRevenue: 0, growthRate: 0 };
    
    return {
      projectedRevenue: avgDailyRevenue * days * (1 + growthRate),
      confidence: this.calculateConfidenceScore(avgDailyRevenue, growthRate)
    };
  }

  private calculateConfidenceScore(avgRevenue: number, growthRate: number): number {
    // Implement confidence score calculation based on data stability
    const volatility = Math.abs(growthRate);
    const baseConfidence = 0.8; // Base confidence score
    
    return Math.max(0, Math.min(1, baseConfidence - (volatility * 0.2)));
  }
}