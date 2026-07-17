import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const translations: Translations = {
  // Navigation
  home: { en: 'Home', hi: 'होम' },
  shop: { en: 'Shop', hi: 'दुकान' },
  vendors: { en: 'Vendors', hi: 'विक्रेता' },
  login: { en: 'Login / Register', hi: 'लॉगिन / रजिस्टर' },
  dashboard: { en: 'Dashboard', hi: 'डैशबोर्ड' },
  
  // Header Actions
  search_placeholder: { en: 'Search for products...', hi: 'उत्पाद खोजें...' },
  cart: { en: 'Cart', hi: 'कार्ट' },
  
  // Common Actions
  place_order: { en: 'Place Order', hi: 'ऑर्डर करें' },
  view_all: { en: 'View All', hi: 'सभी देखें' },
  add_to_cart: { en: 'Add to Cart', hi: 'कार्ट में डालें' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('techverse_language');
    return (saved as Language) || 'en';
  });

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('techverse_language', lang);
  };

  const t = (key: string): string => {
    if (!translations[key]) return key;
    return translations[key][language] || translations[key].en;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
