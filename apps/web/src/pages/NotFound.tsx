import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ShoppingBag } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>404 - Page Not Found | TechVerse</title>
      </Helmet>

      <div className="max-w-xl w-full text-center space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Decorative elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -z-10"></div>

          <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-400 dark:from-primary-500 dark:to-primary-300">
            404
          </h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Oops! Looks like you're lost.
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            The page you are looking for might have been removed, had its name
            changed, or is temporarily unavailable.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6"
        >
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-primary-600 hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/20 transition-all duration-200"
          >
            <Home className="mr-2" size={20} />
            Go to Homepage
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-gray-200 dark:border-dark-700 text-base font-medium rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700 hover:border-gray-300 dark:hover:border-dark-600 transition-all duration-200 shadow-sm"
          >
            <ShoppingBag className="mr-2" size={20} />
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
};
