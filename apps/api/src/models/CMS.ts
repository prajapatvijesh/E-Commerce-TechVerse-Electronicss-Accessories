import mongoose, { Document, Schema } from 'mongoose';

export interface ICMS extends Document {
  page: string;
  title: string;
  content: string; // HTML or Markdown content
  slug: string;
  metaTitle?: string;
  metaDescription?: string;
  isActive: boolean;
  createdBy?: mongoose.Types.ObjectId;
  updatedBy?: mongoose.Types.ObjectId;
}

const CMSSchema = new Schema<ICMS>(
  {
    page: { type: String }, // optional because controller might not pass it
    title: { type: String, required: true },
    content: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    metaTitle: { type: String },
    metaDescription: { type: String },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const CMS = mongoose.model<ICMS>('CMS', CMSSchema);
