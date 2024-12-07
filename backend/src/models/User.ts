import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  createdGroups: Schema.Types.ObjectId[];
  memberGroups: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  createdGroups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
  memberGroups: [{ type: Schema.Types.ObjectId, ref: 'Group' }],
}, { timestamps: true });

export const User = model<IUser>('User', userSchema);