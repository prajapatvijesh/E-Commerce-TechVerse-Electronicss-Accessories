import React from 'react';

export const Card = ({ children, className = '', hover = false }: { children: React.ReactNode; className?: string; hover?: boolean }) => (
  <div className={`bg-white/90 backdrop-blur-md dark:bg-dark-800/95 rounded-2xl shadow-sm border border-gray-100/50 dark:border-dark-700/50 overflow-hidden transition-all duration-300 ${hover ? 'hover:shadow-xl hover:-translate-y-1 hover:border-primary-100 dark:hover:border-primary-900' : ''} ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-6 py-4 border-b border-gray-100 dark:border-dark-700 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-lg font-semibold text-gray-900 dark:text-white ${className}`}>
    {children}
  </h3>
);

export const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);
