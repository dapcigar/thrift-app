import crypto from 'crypto';
import { Group } from '../models/Group';

// Generate secure invite code
export const generateInviteCode = async (): Promise<string> => {
  let inviteCode: string;
  let isUnique = false;

  while (!isUnique) {
    inviteCode = crypto.randomBytes(6).toString('hex');
    const existingGroup = await Group.findOne({ inviteCode });
    if (!existingGroup) {
      isUnique = true;
      return inviteCode;
    }
  }

  throw new Error('Failed to generate unique invite code');
};

// Calculate next payment date based on frequency
export const calculateNextPaymentDate = (
  startDate: Date,
  frequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY'
): Date => {
  const nextDate = new Date(startDate);

  switch (frequency) {
    case 'WEEKLY':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'BIWEEKLY':
      nextDate.setDate(nextDate.getDate() + 14);
      break;
    case 'MONTHLY':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
  }

  return nextDate;
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

// Calculate group progress
export const calculateGroupProgress = (group: any): number => {
  const totalPayments = group.members.length * group.totalMembers;
  const completedPayments = group.payments?.filter(
    (payment: any) => payment.status === 'PAID'
  ).length || 0;

  return Math.round((completedPayments / totalPayments) * 100);
};

// Validate phone number
export const validatePhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
};

// Generate payout schedule
export const generatePayoutSchedule = (
  members: string[],
  startDate: Date,
  frequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY'
) => {
  const schedule = [];
  let currentDate = new Date(startDate);

  for (const memberId of members) {
    schedule.push({
      memberId,
      scheduledDate: new Date(currentDate),
      status: 'PENDING'
    });

    currentDate = calculateNextPaymentDate(currentDate, frequency);
  }

  return schedule;
};