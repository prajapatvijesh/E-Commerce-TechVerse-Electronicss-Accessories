import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button, Input } from '@techverse/ui';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { GoogleLogin } from '@react-oauth/google';
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
            <GoogleLogin
              onSuccess={credentialResponse => {
                if (credentialResponse.credential) {
                  googleMutation.mutate(credentialResponse.credential);
                }
              }}
              onError={() => {
                console.log('Login Failed');
                alert('Google Authentication failed');
              }}
              useOneTap
              theme="outline"
              size="large"
              shape="pill"
            />
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
