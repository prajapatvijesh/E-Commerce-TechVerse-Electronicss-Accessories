import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Button } from '@techverse/ui';

export const Offers: React.FC = () => {
  return (
    <div className="space-y-12 text-center py-20">
      <Helmet>
        <title>Special Offers | TechVerse</title>
        <meta name="description" content="View all active deals and discounts on TechVerse." />
      </Helmet>
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="text-4xl font-extrabold dark:text-white tracking-tight mb-4">Special Offers</h1>
      <p className="text-lg text-gray-500 max-w-xl mx-auto mb-8">
        We currently have a site-wide promotion running! Use code <strong className="text-primary-600">TECH20</strong> to get 20% off your entire first order.
      </p>
      <Link to="/shop">
        <Button variant="primary" size="lg" className="rounded-xl px-8">Start Shopping</Button>
      </Link>
    </div>
  );
};
