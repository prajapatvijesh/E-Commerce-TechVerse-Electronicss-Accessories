import mongoose, { Document, Schema } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  siteLogo?: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  taxRate: number;
  flatShippingRate: number;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
  favicon?: string;
  maintenanceMode: boolean;
  adminCommission: number;
}

const SettingsSchema = new Schema<ISettings>(
  {
    siteName: { type: String, required: true, default: 'TechVerse' },
    siteLogo: { type: String },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    currency: { type: String, default: 'USD' },
    taxRate: { type: Number, default: 0 },
    flatShippingRate: { type: Number, default: 0 },
    socialLinks: {
      facebook: String,
      twitter: String,
      instagram: String,
    },
    favicon: { type: String },
    maintenanceMode: { type: Boolean, default: false },
    adminCommission: { type: Number, default: 10 },
  },
  { timestamps: true }
);

export const Settings = mongoose.model<ISettings>('Settings', SettingsSchema);
