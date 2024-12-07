import { Schema, model, Document } from 'mongoose';

export interface IPayment extends Document {
  groupId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
  transactionId?: string;
}

const paymentSchema = new Schema({
  groupId: { type: Schema.Types.ObjectId, ref: 'Group', required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  paidDate: { type: Date },
  status: { type: String, enum: ['PENDING', 'PAID', 'OVERDUE'], default: 'PENDING' },
  transactionId: { type: String }
}, { timestamps: true });

export const Payment = model<IPayment>('Payment', paymentSchema);