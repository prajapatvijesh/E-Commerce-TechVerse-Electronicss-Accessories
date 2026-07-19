import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Input } from '@techverse/ui';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';

export const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  const registerMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await axios.post('/api/auth/register', data);
      return res.data;
    },
    onSuccess: (data) => {
      dispatch(setCredentials(data.data));
      navigate(redirect.startsWith('/') ? redirect : `/${redirect}`);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || err.message);
    }
  });

  const googleMutation = useMutation({
    mutationFn: async (credential: string) => {
      const res = await axios.post('/api/auth/google', { credential });
      return res.data;
    },
    onSuccess: (data) => {
      dispatch(setCredentials(data.data));
      navigate(redirect.startsWith('/') ? redirect : `/${redirect}`);
    },
    onError: (err: any) => {
      alert(err.response?.data?.message || 'Google Authentication failed');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ name, email, password, role: 'customer' });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute -top-[30%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary-400/20 dark:bg-primary-500/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-400/20 dark:bg-indigo-500/10 blur-[100px]" />
      </div>

      <div className="max-w-md w-full space-y-8 bg-white/80 dark:bg-dark-800/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-white/20 dark:border-dark-600/50 relative transform transition-all hover:scale-[1.01] duration-500">
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-tr from-primary-600 to-indigo-400 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 transform rotate-[15deg] hover:rotate-0 transition-transform duration-500">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>

        <div className="pt-8">
          <h2 className="text-center text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 tracking-tight">
            Create an Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400 font-medium">
            Join TechVerse today
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div className="group">
              <Input
                label="Full Name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="transition-all duration-300 group-hover:border-primary-400 focus:ring-primary-500"
              />
            </div>
            <div className="group">
              <Input
                label="Email address"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="transition-all duration-300 group-hover:border-primary-400 focus:ring-primary-500"
              />
            </div>
            <div className="group">
              <Input
                label="Password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="transition-all duration-300 group-hover:border-primary-400 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              variant="primary" 
              className="w-full py-3 rounded-xl font-semibold shadow-md hover:shadow-xl hover:shadow-primary-500/20 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              disabled={registerMutation.isPending || googleMutation.isPending}
            >
              {registerMutation.isPending ? 'Signing up...' : 'Sign up'}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-dark-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white/80 dark:bg-dark-800/80 text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => googleMutation.mutate('MOCK_GOOGLE_TOKEN')}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 dark:border-dark-600 rounded-full shadow-sm bg-white dark:bg-dark-700 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google (Demo)
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-dark-600/50 text-center text-sm">
          <span className="text-gray-500 dark:text-gray-400">Already have an account? </span>
          <Link to={`/login?redirect=${redirect}`} className="font-bold text-primary-600 hover:text-primary-500 transition-colors hover:underline underline-offset-4">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};
