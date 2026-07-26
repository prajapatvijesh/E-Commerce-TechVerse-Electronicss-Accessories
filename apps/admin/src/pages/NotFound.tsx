import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, ArrowLeft } from 'lucide-react';
import { Button } from '@techverse/ui';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-900 px-4">
      <div className="max-w-md w-full text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary-500/10 rounded-full blur-2xl -z-10"></div>
          <h1 className="text-8xl font-black text-gray-900 dark:text-white">
            404
          </h1>
          <div className="mt-4 w-16 h-1.5 bg-primary-500 mx-auto rounded-full"></div>
          <h2 className="mt-6 text-2xl font-bold text-gray-900 dark:text-white">
            Page Not Found
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            The admin dashboard page you're looking for doesn't exist or you
            don't have access to it.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          <Link to="/">
            <Button
              variant="primary"
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <LayoutDashboard size={18} />
              Go to Dashboard
            </Button>
          </Link>
          <button onClick={() => window.history.back()}>
            <Button
              variant="outline"
              className="w-full sm:w-auto flex items-center justify-center gap-2"
            >
              <ArrowLeft size={18} />
              Go Back
            </Button>
          </button>
        </motion.div>
      </div>
    </div>
  );
};
