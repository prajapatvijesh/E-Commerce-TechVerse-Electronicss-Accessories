import React from 'react';

export const FAQ: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-10">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-extrabold dark:text-white tracking-tight">Frequently Asked Questions</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">Find answers to the most common questions about TechVerse.</p>
      </div>

      <div className="space-y-6">
        <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl border border-gray-100 dark:border-dark-700/50 shadow-sm">
          <h3 className="font-bold text-lg dark:text-white mb-2">How long does shipping take?</h3>
          <p className="text-gray-600 dark:text-gray-400">Standard shipping usually takes 3-5 business days. Express shipping is available for 1-2 day delivery at an additional cost during checkout.</p>
        </div>
        <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl border border-gray-100 dark:border-dark-700/50 shadow-sm">
          <h3 className="font-bold text-lg dark:text-white mb-2">Can I track my order?</h3>
          <p className="text-gray-600 dark:text-gray-400">Yes! Once your order ships, you will receive an email with tracking information. You can also view your order status in your Account Dashboard.</p>
        </div>
        <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl border border-gray-100 dark:border-dark-700/50 shadow-sm">
          <h3 className="font-bold text-lg dark:text-white mb-2">Are your products authentic?</h3>
          <p className="text-gray-600 dark:text-gray-400">Absolutely. We only source directly from authorized vendors and official brand manufacturers. All products come with a minimum 1-year official warranty.</p>
        </div>
        <div className="bg-white dark:bg-dark-800 p-6 rounded-2xl border border-gray-100 dark:border-dark-700/50 shadow-sm">
          <h3 className="font-bold text-lg dark:text-white mb-2">Do you offer international shipping?</h3>
          <p className="text-gray-600 dark:text-gray-400">Currently, we only ship within the continental United States, Canada, and the UK. We plan to expand to more regions soon.</p>
        </div>
      </div>
    </div>
  );
};
