import mongoose from 'mongoose';

export interface IBanner extends mongoose.Document {
  title: string;
  image: string;
  link: string;
  position: 'hero' | 'mid-section' | 'sidebar';
  isActive: boolean;
  order: number;
}

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      default: '/',
    },
    position: {
      type: String,
      enum: ['hero', 'mid-section', 'sidebar'],
      default: 'hero',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Banner = mongoose.model<IBanner>('Banner', bannerSchema);
