import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { FeeReportingService } from '../../services/feeReportingService';
import { ServiceFee } from '../../models/ServiceFee';

describe('Fee Reporting Tests', () => {
  let feeReportingService: FeeReportingService;

  beforeEach(() => {
    feeReportingService = new FeeReportingService();
  });

  it('should generate monthly summary report', async () => {
    const mockAggregateResults = [{
      _id: null,
      totalFees: 1000,
      totalRefunds: 50,
      netRevenue: 950,
      transactionCount: 10,
      averageFee: 100,
      uniqueUserCount: 5,
      uniqueGroupCount: 3
    }];

    ServiceFee.aggregate = jest.fn().mockResolvedValue(mockAggregateResults);

    const result = await feeReportingService.generateMonthlySummary(1, 2024);

    expect(result.summary.totalFees).toBe(1000);
    expect(result.summary.netRevenue).toBe(950);
    expect(result.summary.transactionCount).toBe(10);
  });

  it('should generate custom report with specified metrics', async () => {
    const mockResults = [
      {
        _id: { date: '2024-01-01' },
        revenue: 500,
        uniqueUsers: ['user1', 'user2'],
        uniqueGroups: ['group1']
      }
    ];

    ServiceFee.aggregate = jest.fn().mockResolvedValue(mockResults);

    const result = await feeReportingService.generateCustomReport({
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      metrics: ['revenue', 'users'],
      breakdowns: ['daily']
    });

    expect(result).toHaveLength(1);
    expect(result[0].revenue).toBe(500);
    expect(result[0].uniqueUsers).toHaveLength(2);
  });

  it('should generate PDF report successfully', async () => {
    const mockSummaryData = [
      {
        _id: '2024-01-01',
        totalFees: 100,
        transactionCount: 5,
        averageFee: 20
      }
    ];

    const result = await feeReportingService.generateReport({
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-31'),
      format: 'PDF'
    });

    expect(typeof result).toBe('string');
    expect(result).toContain('.pdf');
  });
});
