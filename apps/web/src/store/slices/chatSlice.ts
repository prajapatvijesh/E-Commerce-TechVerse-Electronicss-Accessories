import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatState {
  isOpen: boolean;
  receiverId: string | null;
  receiverName: string;
}

const initialState: ChatState = {
  isOpen: false,
  receiverId: 'admin', // default to admin support
  receiverName: 'Customer Support',
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    openChat: (state, action: PayloadAction<{ receiverId: string, receiverName: string }>) => {
      state.isOpen = true;
      state.receiverId = action.payload.receiverId;
      state.receiverName = action.payload.receiverName;
    },
    closeChat: (state) => {
      state.isOpen = false;
    },
    toggleChat: (state) => {
      state.isOpen = !state.isOpen;
    }
  },
});

export const { openChat, closeChat, toggleChat } = chatSlice.actions;
export default chatSlice.reducer;
