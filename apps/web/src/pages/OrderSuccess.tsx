import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@techverse/ui';
import { CheckCircle } from 'lucide-react';

export const OrderSuccess: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-700 max-w-lg w-full text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-500">
            <CheckCircle size={48} />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Order Confirmed!</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Thank you for your purchase. We have received your order and will send you a confirmation email with tracking details shortly.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link to="/dashboard" className="flex-1">
            <Button variant="primary" className="w-full">
              View Order Details
            </Button>
          </Link>
          <Link to="/shop" className="flex-1">
            <Button variant="outline" className="w-full">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
