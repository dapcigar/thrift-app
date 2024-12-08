import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  type: 'CONTRIBUTION' | 'PAYOUT' | 'REFUND' | 'FEE';
  userId: mongoose.Types.ObjectId;
  groupId?: mongoose.Types.ObjectId;
  paymentId?: mongoose.Types.ObjectId;
  amount: number;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REVERSED';
  direction: 'IN' | 'OUT';
  description: string;
  metadata: {
    paymentMethod?: string;
    transactionId?: string;
    failureReason?: string;
    reversalReason?: string;
  };
  processingFee?: number;
  balanceAfter?: number;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema({
  type: { 
    type: String, 
    enum: ['CONTRIBUTION', 'PAYOUT', 'REFUND', 'FEE'],
    required: true 
  },
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  groupId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Group' 
  },
  paymentId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Payment' 
  },
  amount: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'COMPLETED', 'FAILED', 'REVERSED'],
    default: 'PENDING'
  },
  direction: { 
    type: String, 
    enum: ['IN', 'OUT'],
    required: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  metadata: {
    paymentMethod: String,
    transactionId: String,
    failureReason: String,
    reversalReason: String
  },
  processingFee: Number,
  balanceAfter: Number
}, { 
  timestamps: true 
});

// Indexes for efficient querying
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ groupId: 1, type: 1, status: 1 });
transactionSchema.index({ status: 1, createdAt: 1 });

// Virtual field for amount with sign
transactionSchema.virtual('signedAmount').get(function() {
  return this.direction === 'IN' ? this.amount : -this.amount;
});

// Pre-save middleware to calculate balance
transactionSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const lastTransaction = await this.constructor.findOne(
        { userId: this.userId },
        { balanceAfter: 1 },
        { sort: { createdAt: -1 } }
      );

      const previousBalance = lastTransaction ? lastTransaction.balanceAfter : 0;
      this.balanceAfter = previousBalance + this.signedAmount;
      
      if (this.balanceAfter < 0) {
        throw new Error('Insufficient balance');
      }
      
      next();
    } catch (error) {
      next(error);
    }
  } else {
    next();
  }
});

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
export default Transaction;