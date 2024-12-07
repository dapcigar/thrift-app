import { Schema, model, Document } from 'mongoose';

export interface IGroup extends Document {
  name: string;
  coordinator: Schema.Types.ObjectId;
  members: {
    userId: Schema.Types.ObjectId;
    status: string;
    joinedAt: Date;
  }[];
  totalMembers: number;
  contributionAmount: number;
  frequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
  startDate: Date;
  endDate: Date;
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED';
  inviteCode: string;
  payoutSchedule: {
    userId: Schema.Types.ObjectId;
    scheduledDate: Date;
    status: string;
  }[];
}

const groupSchema = new Schema({
  name: { type: String, required: true },
  coordinator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    status: { type: String, enum: ['PENDING', 'ACTIVE'], default: 'PENDING' },
    joinedAt: { type: Date, default: Date.now }
  }],
  totalMembers: { type: Number, required: true },
  contributionAmount: { type: Number, required: true },
  frequency: { type: String, enum: ['WEEKLY', 'BIWEEKLY', 'MONTHLY'], required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  status: { type: String, enum: ['PENDING', 'ACTIVE', 'COMPLETED'], default: 'PENDING' },
  inviteCode: { type: String, unique: true },
  payoutSchedule: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    scheduledDate: { type: Date },
    status: { type: String, enum: ['PENDING', 'COMPLETED'] }
  }]
}, { timestamps: true });

export const Group = model<IGroup>('Group', groupSchema);