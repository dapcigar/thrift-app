import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { FeeCalculationService } from '../../services/feeCalculationService';
import { AdminConfig } from '../../models/AdminConfig';
import { User } from '../../models/User';
import { Group } from '../../models/Group';

describe('Fee Calculation Tests', () => {
  it('should respect maximum fee limit', async () => {
    const mockConfig = {
      isPercentageBased: true,
      serviceFeePercentage: 2,
      minimumFee: 5,
      maximumFee: 100
    };

    AdminConfig.findOne = jest.fn().mockResolvedValue(mockConfig);

    const result = await feeCalculationService.calculateFee({
      amount: 10000, // 2% would be 200, but should be capped at 100
      userId: 'user123',
      groupId: 'group123'
    });

    expect(result.feeAmount).toBe(100); // Should use maximum fee
  });

  it('should calculate volume-based discounts correctly', async () => {
    const mockConfig = {
      isPercentageBased: true,
      serviceFeePercentage: 1.5
    };

    const mockVolume = 15000; // High volume should trigger discount

    AdminConfig.findOne = jest.fn().mockResolvedValue(mockConfig);
    (feeCalculationService as any).getUserTransactionVolume = 
      jest.fn().mockResolvedValue(mockVolume);

    const result = await feeCalculationService.calculateFee({
      amount: 1000,
      userId: 'user123',
      groupId: 'group123',
      calculationMethod: 'VOLUME_BASED'
    });

    expect(result.details.discount).toBe(0.3); // 30% discount for high volume
    expect(result.details.volume).toBe(mockVolume);
  });

  it('should handle promotional fee calculations', async () => {
    const mockPromotion = {
      type: 'NEW_USER',
      discount: 0.5 // 50% off
    };

    (feeCalculationService as any).getActivePromotion = 
      jest.fn().mockResolvedValue(mockPromotion);

    const result = await feeCalculationService.calculateFee({
      amount: 1000,
      userId: 'user123',
      groupId: 'group123',
      calculationMethod: 'PROMOTIONAL'
    });

    expect(result.details.type).toBe('NEW_USER');
    expect(result.details.discount).toBe(0.5);
  });
});