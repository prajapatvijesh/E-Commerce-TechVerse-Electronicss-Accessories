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

// Check localStorage for existing user
const userJson = localStorage.getItem('user');
let savedUser: User | null = null;
try {
  if (userJson) {
    savedUser = JSON.parse(userJson);
  }
} catch (e) {
  console.error('Failed to parse user from localStorage');
}

const initialState: AuthState = {
  user: savedUser,
  isAuthenticated: !!savedUser,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<User>) => {
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
