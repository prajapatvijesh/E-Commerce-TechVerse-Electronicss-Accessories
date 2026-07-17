import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'vendor' | 'admin' | 'superadmin';
  token: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const storedUser = localStorage.getItem('user');
const user = storedUser ? JSON.parse(storedUser) : null;

const initialState: AuthState = {
  user: user,
  isAuthenticated: !!user,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<User>
    ) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
