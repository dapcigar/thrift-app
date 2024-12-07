import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { FeeRefundService } from '../../services/feeRefundService';
import { ServiceFee } from '../../models/ServiceFee';
import { NotificationService } from '../../services/notificationService';
import { EmailService } from '../../services/emailService';
import { RefundReason } from '../../services/feeRefundService';

describe('Fee Refund Tests', () => {
  let feeRefundService: FeeRefundService;
  let mockNotificationService: jest.Mocked<NotificationService>;
  let mockEmailService: jest.Mocked<EmailService>;

  beforeEach(() => {
    mockNotificationService = {
      notifyFeeRefund: jest.fn()
    } as any;

    mockEmailService = {
      sendRefundNotification: jest.fn()
    } as any;

    feeRefundService = new FeeRefundService(
      mockNotificationService,
      mockEmailService
    );
  });

  it('should process refund successfully', async () => {
    const mockServiceFee = {
      _id: 'fee123',
      feeAmount: 100,
      status: 'PAID',
      refundedAmount: 0,
      save: jest.fn()
    };

    ServiceFee.findById = jest.fn().mockResolvedValue(mockServiceFee);

    const result = await feeRefundService.processRefund({
      feeId: 'fee123',
      amount: 50,
      reason: RefundReason.CUSTOMER_REQUEST,
      adminId: 'admin123'
    });

    expect(mockServiceFee.save).toHaveBeenCalled();
    expect(mockNotificationService.notifyFeeRefund).toHaveBeenCalled();
    expect(mockEmailService.sendRefundNotification).toHaveBeenCalled();
  });

  it('should handle bulk refunds correctly', async () => {
    const mockFees = [
      { _id: 'fee1', feeAmount: 100, status: 'PAID', save: jest.fn() },
      { _id: 'fee2', feeAmount: 200, status: 'PAID', save: jest.fn() }
    ];

    ServiceFee.find = jest.fn().mockResolvedValue(mockFees);

    const results = await feeRefundService.processBulkRefund({
      feeIds: ['fee1', 'fee2'],
      reason: RefundReason.SYSTEM_ERROR,
      adminId: 'admin123',
      refundPercentage: 50
    });

    expect(results.length).toBe(2);
    expect(mockNotificationService.notifyFeeRefund).toHaveBeenCalledTimes(2);
  });

  it('should prevent refund amount exceeding original fee', async () => {
    const mockServiceFee = {
      _id: 'fee123',
      feeAmount: 100,
      status: 'PAID'
    };

    ServiceFee.findById = jest.fn().mockResolvedValue(mockServiceFee);

    await expect(
      feeRefundService.processRefund({
        feeId: 'fee123',
        amount: 150, // Greater than original fee
        reason: RefundReason.CUSTOMER_REQUEST,
        adminId: 'admin123'
      })
    ).rejects.toThrow('Refund amount cannot exceed original fee amount');
  });
});