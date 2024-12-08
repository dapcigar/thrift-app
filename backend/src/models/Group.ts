import mongoose, { Schema, Document } from 'mongoose';

export interface IGroup extends Document {
  name: string;
  description?: string;
  coordinator: mongoose.Types.ObjectId;
  members: Array<{
    userId: mongoose.Types.ObjectId;
    role: 'MEMBER' | 'ADMIN';
    status: 'PENDING' | 'ACTIVE' | 'INACTIVE';
    joinedAt: Date;
  }>;
  settings: {
    totalMembers: number;
    contributionAmount: number;
    frequency: 'WEEKLY' | 'BIWEEKLY' | 'MONTHLY';
    startDate: Date;
    endDate?: Date;
    autoReminders: boolean;
    allowLatePayments: boolean;
    gracePeriod: number;
  };
  status: 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED';
  inviteCode?: string;
  payoutSchedule: Array<{
    userId: mongoose.Types.ObjectId;
    scheduledDate: Date;
    amount: number;
    status: 'PENDING' | 'COMPLETED' | 'FAILED';
    processedAt?: Date;
  }>;
  totalContributed: number;
  totalPaidOut: number;
  currentRound: number;
  createdAt: Date;
  updatedAt: Date;
}

const groupSchema = new Schema({
  name: { 
    type: String, 
    required: true,
    trim: true
  },
  description: String,
  coordinator: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  members: [{
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    },
    role: { 
      type: String, 
      enum: ['MEMBER', 'ADMIN'],
      default: 'MEMBER'
    },
    status: { 
      type: String, 
      enum: ['PENDING', 'ACTIVE', 'INACTIVE'],
      default: 'PENDING'
    },
    joinedAt: { 
      type: Date, 
      default: Date.now 
    }
  }],
  settings: {
    totalMembers: { 
      type: Number, 
      required: true,
      min: 2
    },
    contributionAmount: { 
      type: Number, 
      required: true,
      min: 0
    },
    frequency: { 
      type: String, 
      enum: ['WEEKLY', 'BIWEEKLY', 'MONTHLY'],
      required: true
    },
    startDate: { 
      type: Date, 
      required: true 
    },
    endDate: Date,
    autoReminders: { 
      type: Boolean, 
      default: true 
    },
    allowLatePayments: { 
      type: Boolean, 
      default: false 
    },
    gracePeriod: { 
      type: Number, 
      default: 0 
    }
  },
  status: { 
    type: String, 
    enum: ['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  inviteCode: { 
    type: String, 
    unique: true,
    sparse: true
  },
  payoutSchedule: [{
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    },
    scheduledDate: { 
      type: Date, 
      required: true 
    },
    amount: { 
      type: Number, 
      required: true 
    },
    status: { 
      type: String, 
      enum: ['PENDING', 'COMPLETED', 'FAILED'],
      default: 'PENDING'
    },
    processedAt: Date
  }],
  totalContributed: { 
    type: Number, 
    default: 0 
  },
  totalPaidOut: { 
    type: Number, 
    default: 0 
  },
  currentRound: { 
    type: Number, 
    default: 0 
  }
}, { 
  timestamps: true 
});

// Middleware to generate unique invite code
groupSchema.pre('save', async function(next) {
  if (this.isNew && !this.inviteCode) {
    this.inviteCode = Math.random().toString(36).substring(2, 15);
  }
  next();
});

const Group = mongoose.model<IGroup>('Group', groupSchema);
export default Group;