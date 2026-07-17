import mongoose, { Document, Schema } from 'mongoose';

export interface IVendor extends Document {
  user: mongoose.Types.ObjectId;
  storeName: string;
  storeDescription: string;
  logo?: string;
  banner?: string;
  businessAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
  contactEmail: string;
  contactPhone: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  commissionRate: number; // Percentage
  rating: number;
  totalReviews: number;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  gstNumber?: string;
}

const VendorSchema = new Schema<IVendor>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    storeName: { type: String, required: true, unique: true },
    storeDescription: { type: String, required: true },
    logo: { type: String },
    banner: { type: String },
    businessAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'suspended'],
      default: 'pending',
    },
    commissionRate: { type: Number, default: 10 },
    rating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    socialLinks: {
      facebook: String,
      twitter: String,
      instagram: String,
      website: String,
    },
    gstNumber: { type: String },
  },
  { timestamps: true }
);

export const Vendor = mongoose.model<IVendor>('Vendor', VendorSchema);
