import mongoose, { Document, Schema } from 'mongoose';

export interface IBanner {
  image: string;
  title: string;
  subtitle: string;
  link: string;
}

export interface IFAQ {
  question: string;
  answer: string;
}

export interface IHomepageSettings extends Document {
  heroBanners: IBanner[];
  featuredCategories: mongoose.Types.ObjectId[];
  faqs: IFAQ[];
  footerText: string;
  updatedBy?: mongoose.Types.ObjectId;
}

const HomepageSettingsSchema = new Schema<IHomepageSettings>(
  {
    heroBanners: [
      {
        image: { type: String },
        title: { type: String },
        subtitle: { type: String },
        link: { type: String }
      }
    ],
    featuredCategories: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
    faqs: [
      {
        question: { type: String },
        answer: { type: String }
      }
    ],
    footerText: { type: String, default: '© 2026 TechVerse Marketplace. All rights reserved.' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export const HomepageSettings = mongoose.model<IHomepageSettings>('HomepageSettings', HomepageSettingsSchema);
