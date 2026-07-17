import React from 'react';

export const Returns: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <h1 className="text-4xl font-extrabold dark:text-white tracking-tight">Returns & Refunds Policy</h1>
      
      <div className="prose dark:prose-invert max-w-none space-y-6 text-gray-600 dark:text-gray-300">
        <p className="text-lg">
          At TechVerse, we want you to be completely satisfied with your purchase. If you change your mind or if the product isn't what you expected, our returns policy is simple and hassle-free.
        </p>

        <h2 className="text-2xl font-bold dark:text-white text-gray-900 mt-8 mb-4">30-Day Return Window</h2>
        <p>
          You have 30 days from the date of delivery to return most unopened, new items for a full refund. We will also pay the return shipping costs if the return is a result of our error (you received an incorrect or defective item).
        </p>

        <h2 className="text-2xl font-bold dark:text-white text-gray-900 mt-8 mb-4">Conditions for Return</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Items must be in original condition and packaging.</li>
          <li>All accessories, manuals, and included software must be returned.</li>
          <li>Opened software, sealed media, or hygiene-related items (like in-ear headphones) cannot be returned unless defective.</li>
        </ul>

        <h2 className="text-2xl font-bold dark:text-white text-gray-900 mt-8 mb-4">How to Initiate a Return</h2>
        <p>
          To return an item, go to your <strong>Dashboard</strong> &gt; <strong>Order History</strong>. Select the order and click on the "Request Return" button. You will receive an email with a prepaid shipping label and instructions.
        </p>

        <h2 className="text-2xl font-bold dark:text-white text-gray-900 mt-8 mb-4">Refund Process</h2>
        <p>
          You should expect to receive your refund within four weeks of giving your package to the return shipper, however, in many cases you will receive a refund more quickly. This time period includes the transit time for us to receive your return, the time it takes us to process your return once we receive it, and the time it takes your bank to process our refund request.
        </p>
      </div>
    </div>
  );
};
