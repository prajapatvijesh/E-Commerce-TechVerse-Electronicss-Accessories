import mongoose, { Document, Schema } from 'mongoose';

export interface ICartItem {
  product: mongoose.Types.ObjectId;
  vendor?: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
  variant?: string;
}

export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  totalPrice: number;
}

const CartSchema = new Schema<ICart>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        vendor: { type: Schema.Types.ObjectId, ref: 'Vendor' },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true },
        variant: { type: String },
      },
    ],
    totalPrice: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

export const Cart = mongoose.model<ICart>('Cart', CartSchema);
