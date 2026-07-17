import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  product: string; // Product ID
  name: string;
  price: number;
  image: string;
  qty: number;
  vendor: string; // Vendor ID
  variants?: any;
}

interface CartState {
  cartItems: CartItem[];
  shippingAddress: any;
  paymentMethod: string;
}

const cartJson = localStorage.getItem('cartItems');
let savedCart: CartItem[] = [];
try {
  if (cartJson) {
    savedCart = JSON.parse(cartJson);
  }
} catch (e) {
  console.error('Failed to parse cartItems from localStorage');
}

const initialState: CartState = {
  cartItems: savedCart,
  shippingAddress: {},
  paymentMethod: 'PayPal',
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x.product === item.product);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x.product === existItem.product ? item : x
        );
      } else {
        state.cartItems.push(item);
      }
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter((x) => x.product !== action.payload);
      localStorage.setItem('cartItems', JSON.stringify(state.cartItems));
    },
    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem('cartItems');
    }
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
