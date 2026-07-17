import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CompareProduct {
  _id: string;
  name: string;
  price: number;
  salePrice?: number;
  thumbnail: string;
  brand: string;
  attributes: { name: string; value: string }[];
  rating: number;
}

interface CompareState {
  items: CompareProduct[];
}

const initialState: CompareState = {
  items: localStorage.getItem('compareItems') 
    ? JSON.parse(localStorage.getItem('compareItems')!) 
    : []
};

const compareSlice = createSlice({
  name: 'compare',
  initialState,
  reducers: {
    addToCompare: (state, action: PayloadAction<CompareProduct>) => {
      const exists = state.items.find(item => item._id === action.payload._id);
      if (!exists) {
        if (state.items.length >= 4) {
          // Limit to 4 items for UI reasons
          alert('You can only compare up to 4 items at once. Please remove an item first.');
        } else {
          state.items.push(action.payload);
          localStorage.setItem('compareItems', JSON.stringify(state.items));
          alert('Added to compare list!');
        }
      } else {
        alert('Item is already in the compare list.');
      }
    },
    removeFromCompare: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item._id !== action.payload);
      localStorage.setItem('compareItems', JSON.stringify(state.items));
    },
    clearCompare: (state) => {
      state.items = [];
      localStorage.removeItem('compareItems');
    }
  }
});

export const { addToCompare, removeFromCompare, clearCompare } = compareSlice.actions;
export default compareSlice.reducer;
