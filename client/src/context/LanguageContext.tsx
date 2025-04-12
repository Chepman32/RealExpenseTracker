import React, { createContext, useState, ReactNode, useContext, useEffect } from 'react';
import { translations } from '../i18n/translations';

type Language = 'en' | 'ru';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key) => key,
});

const isBrowser = typeof window !== 'undefined';

const getStoredLanguage = (): Language => {
  if (!isBrowser) return 'en';
  
  try {
    const storedLanguage = localStorage.getItem('language');
    if (storedLanguage === 'en' || storedLanguage === 'ru') {
      return storedLanguage;
    }
  } catch (error) {
    console.error('Failed to access localStorage:', error);
  }
  
  return 'en'; // Default language
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>(getStoredLanguage);

  // Update localStorage when language changes
  useEffect(() => {
    if (isBrowser) {
      try {
        localStorage.setItem('language', language);
        document.documentElement.lang = language;
      } catch (error) {
        console.error('Failed to write to localStorage:', error);
      }
    }
  }, [language]);

  // Translation function
  const t = (key: string): string => {
    if (!key) return '';
    
    const keys = key.split('.');
    let translation: any = translations[language];
    
    console.log('Current language:', language);
    console.log('Translation key:', key);
    console.log('Available translations:', translations);
    
    for (const k of keys) {
      if (translation && translation[k]) {
        translation = translation[k];
      } else {
        console.log('Translation not found for key:', k, 'in path:', key);
        return key; // Return the key if translation is not found
      }
    }
    
    console.log('Final translation:', translation);
    return typeof translation === 'string' ? translation : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  return context;
};
