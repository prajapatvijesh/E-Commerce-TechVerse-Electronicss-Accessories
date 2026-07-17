import React, { useState } from 'react';
import { X, ShieldCheck } from 'lucide-react';

interface DummyRazorpayPopupProps {
  amount: number;
  onSuccess: (paymentId: string) => void;
  onClose: () => void;
}

export const DummyRazorpayPopup: React.FC<DummyRazorpayPopupProps> = ({ amount, onSuccess, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState('upi');

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onSuccess(`pay_dummy_${Math.random().toString(36).substr(2, 9)}`);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-dark-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-[#02042b] p-5 text-white flex justify-between items-start">
          <div>
            <div className="text-xl font-bold tracking-tighter mb-1">TechVerse</div>
            <div className="text-white/80 text-sm">Test Mode</div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-5 border-b border-gray-100 dark:border-dark-800 bg-[#02042b]/5">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Amount to pay</span>
            <span className="text-2xl font-bold text-gray-900 dark:text-white">₹{amount.toFixed(2)}</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 flex space-x-4">
          <div className="w-1/3 border-r border-gray-100 dark:border-dark-800 pr-4 space-y-2">
            <button 
              onClick={() => setMethod('upi')}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg ${method === 'upi' ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-800'}`}
            >
              UPI
            </button>
            <button 
              onClick={() => setMethod('card')}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg ${method === 'card' ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-800'}`}
            >
              Card
            </button>
            <button 
              onClick={() => setMethod('netbanking')}
              className={`w-full text-left px-3 py-2 text-sm rounded-lg ${method === 'netbanking' ? 'bg-primary-50 text-primary-600 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-800'}`}
            >
              Netbanking
            </button>
          </div>
          
          <div className="w-2/3 pl-2">
            {method === 'upi' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-900 dark:text-white font-medium">Pay with UPI ID</p>
                <input type="text" placeholder="user@upi" className="w-full px-3 py-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 dark:text-white text-sm focus:outline-none focus:border-[#3382FF]" />
              </div>
            )}
            {method === 'card' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-900 dark:text-white font-medium">Enter Card Details</p>
                <input type="text" placeholder="Card Number" className="w-full px-3 py-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 dark:text-white text-sm focus:outline-none focus:border-[#3382FF]" />
                <div className="flex space-x-2">
                  <input type="text" placeholder="MM/YY" className="w-1/2 px-3 py-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 dark:text-white text-sm focus:outline-none focus:border-[#3382FF]" />
                  <input type="text" placeholder="CVV" className="w-1/2 px-3 py-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 dark:text-white text-sm focus:outline-none focus:border-[#3382FF]" />
                </div>
              </div>
            )}
            {method === 'netbanking' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-900 dark:text-white font-medium">Select Bank</p>
                <select className="w-full px-3 py-2 border rounded-md dark:bg-dark-800 dark:border-dark-700 dark:text-white text-sm focus:outline-none focus:border-[#3382FF]">
                  <option>State Bank of India</option>
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>Axis Bank</option>
                </select>
              </div>
            )}
            
            <button 
              onClick={handlePay}
              disabled={loading}
              className="w-full mt-6 bg-[#3382FF] hover:bg-[#2068d6] text-white py-3 rounded-lg font-medium transition-colors disabled:opacity-70 flex justify-center items-center"
            >
              {loading ? 'Processing...' : `Pay ₹${amount.toFixed(2)}`}
            </button>
          </div>
        </div>
        
        {/* Footer */}
        <div className="bg-gray-50 dark:bg-dark-950 p-3 border-t border-gray-100 dark:border-dark-800 flex justify-center items-center space-x-2 text-xs text-gray-500">
          <ShieldCheck size={14} className="text-green-500" />
          <span>Secured by Razorpay</span>
        </div>
      </div>
    </div>
  );
};
