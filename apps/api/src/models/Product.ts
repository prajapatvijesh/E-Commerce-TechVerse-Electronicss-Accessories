import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  vendor: mongoose.Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  category: mongoose.Types.ObjectId;
  brand: mongoose.Types.ObjectId;
  price: number;
  salePrice?: number;
  images: string[];
  thumbnail: string;
  stock: number;
  sku: string;
  variants?: {
    name: string;
    options: {
      name: string;
      price: number;
      stock: number;
    }[];
  }[];
  attributes?: {
    name: string;
    value: string;
  }[];
  rating: number;
  numReviews: number;
  isFeatured: boolean;
  isActive: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  tags?: string[];
  status: 'draft' | 'published' | 'archived';
}

const ProductSchema = new Schema<IProduct>(
  {
    vendor: { type: Schema.Types.ObjectId, ref: 'Vendor', required: true },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    brand: { type: Schema.Types.ObjectId, ref: 'Brand', required: true },
    price: { type: Number, required: true },
    salePrice: { type: Number },
    images: [{ type: String }],
    thumbnail: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    sku: { type: String, required: true, unique: true },
    variants: [
      {
        name: String, // e.g., Color
        options: [
          {
            name: String, // e.g., Red
            price: Number,
            stock: Number,
          },
        ],
      },
    ],
    attributes: [
      {
        name: String, // e.g., Storage
        value: String, // e.g., 256GB
      },
    ],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    tags: [{ type: String }],
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'archived'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model<IProduct>('Product', ProductSchema);
