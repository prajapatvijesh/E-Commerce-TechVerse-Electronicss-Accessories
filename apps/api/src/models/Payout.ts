import mongoose, { Document, Schema } from 'mongoose';

export interface IPayout extends Document {
  vendor: mongoose.Types.ObjectId;
  amount: number;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  paymentMethod: string;
  accountDetails: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PayoutSchema = new Schema<IPayout>(
  {
    vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'paid'],
      default: 'pending',
    },
    paymentMethod: { type: String, required: true },
    accountDetails: { type: String, required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

export const Payout = mongoose.model<IPayout>('Payout', PayoutSchema);
