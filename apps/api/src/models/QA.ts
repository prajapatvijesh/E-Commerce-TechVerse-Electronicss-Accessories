import mongoose, { Document, Schema } from 'mongoose';

export interface IQA extends Document {
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  question: string;
  answer?: string;
  answeredBy?: mongoose.Types.ObjectId;
  status: 'pending' | 'answered' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

const QASchema = new Schema<IQA>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    question: { type: String, required: true },
    answer: { type: String },
    answeredBy: { type: Schema.Types.ObjectId, ref: 'User' },
    status: {
      type: String,
      enum: ['pending', 'answered', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

export const QA = mongoose.model<IQA>('QA', QASchema);
