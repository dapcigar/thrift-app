import { Schema, model, Document } from 'mongoose';

export interface IAdminConfig extends Document {
  serviceFeePercentage: number;
  flatFee: number;
  minimumFee: number;
  maximumFee: number;
  isPercentageBased: boolean;
  lastUpdatedBy: Schema.Types.ObjectId;
  updatedAt: Date;
  createdAt: Date;
  isActive: boolean;
}

const adminConfigSchema = new Schema({
  serviceFeePercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 1 // 1% default service fee
  },
  flatFee: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  minimumFee: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  maximumFee: {
    type: Number,
    required: true,
    min: 0,
    default: 1000
  },
  isPercentageBased: {
    type: Boolean,
    default: true
  },
  lastUpdatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export const AdminConfig = model<IAdminConfig>('AdminConfig', adminConfigSchema);