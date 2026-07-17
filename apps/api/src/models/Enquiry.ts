import mongoose, { Document, Schema } from 'mongoose';

export interface IEnquiry extends Document {
  user: mongoose.Types.ObjectId;
  product?: mongoose.Types.ObjectId;
  vendor: mongoose.Types.ObjectId;
  quantity: number;
  message: string;
  quotedPrice?: number;
  reply?: string;
  adminNote?: string;
  status: 'new' | 'replied' | 'accepted' | 'rejected' | 'converted';
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product' }, // optional for bulk quotes without specific product
    vendor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    quantity: { type: Number, default: 1 },
    message: { type: String, required: true },
    quotedPrice: { type: Number },
    reply: { type: String },
    adminNote: { type: String },
    status: { 
      type: String, 
      enum: ['new', 'replied', 'accepted', 'rejected', 'converted'], 
      default: 'new' 
    }
  },
  { timestamps: true }
);

export const Enquiry = mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
