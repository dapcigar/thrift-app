import { Schema, model, Document } from 'mongoose';

export interface IServiceFee extends Document {
  userId: Schema.Types.ObjectId;
  groupId: Schema.Types.ObjectId;
  paymentId: Schema.Types.ObjectId;
  amount: number;
  feeAmount: number;
  feePercentage: number;
  calculationMethod: 'PERCENTAGE' | 'FLAT';
  status: 'PENDING' | 'PAID' | 'FAILED';
  chargeDate: Date;
  paidDate?: Date;
  transactionId?: string;
}

const serviceFeeSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  groupId: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  paymentId: {
    type: Schema.Types.ObjectId,
    ref: 'Payment',
    required: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  feeAmount: {
    type: Number,
    required: true,
    min: 0
  },
  feePercentage: {
    type: Number,
    required: true,
    min: 0
  },
  calculationMethod: {
    type: String,
    enum: ['PERCENTAGE', 'FLAT'],
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'FAILED'],
    default: 'PENDING'
  },
  chargeDate: {
    type: Date,
    required: true
  },
  paidDate: Date,
  transactionId: String
}, { timestamps: true });

export const ServiceFee = model<IServiceFee>('ServiceFee', serviceFeeSchema);