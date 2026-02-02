'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Define supported languages
export type Language = 'es' | 'en' | 'fr';

// Define the shape of our translations
export interface TranslationKeys {
  common: {
    welcome: string;
    home: string;
    stores: string;
    calculator: string;
    orders: string;
    tracking: string;
    support: string;
    login: string;
    signup: string;
    logout: string;
    back: string;
    continue: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    view: string;
    search: string;
    settings: string;
    not_found: string;
    page_not_found: string;
    go_home: string;
    contact_support: string;
    system_status: string;
    help: string;
    email: string;
    email_placeholder: string;
    password: string;
    password_placeholder: string;
    forgot_password: string;
    access_restricted: string;
    login_required: string;
    or: string;
    copyright: string;
    no_permissions: string;
    permission_denied: string;
    request_access: string;
    logout_other_account: string;
    technical_difficulties: string;
    engineers_working: string;
    refresh_page: string;
    systems_maintenance: string;
    working_normal: string;
    error_code_500: string;
    coming_soon_2024: string;
    coming_soon_big: string;
    coming_soon_hands: string;
    coming_soon_details: string;
    notify_me: string;
    be_first_to_know: string;
    launch: string;
    very_soon: string;
    shipping: string;
    global: string;
    guarantee: string;
  };
  navigation: {
    home: string;
    calculator: string;
    stores: string;
    orders: string;
    admin: string;
  };
  hero: {
    title: string;
    subtitle: string;
    cta: string;
  };
  calculator: {
    title: string;
    store: string;
    weight: string;
    value: string;
    estimated: string;
    includes: string;
    delivery_time: string;
  };
  stores: {
    title: string;
    description: string;
    explore: string;
    temu: {
      name: string;
      description: string;
      features: string[];
    };
    shein: {
      name: string;
      description: string;
      features: string[];
    };
    amazon: {
      name: string;
      description: string;
      features: string[];
    };
  };
  tracking: {
    title: string;
    description: string;
    status: string;
    location: string;
    transit: string;
    delivered: string;
    in_transit: string;
    pending: string;
  };
  footer: {
    about: string;
    blog: string;
    careers: string;
    press: string;
    help_center: string;
    contact: string;
    terms: string;
    privacy: string;
    instagram: string;
    facebook: string;
    twitter: string;
    youtube: string;
  };
}

// Create context
interface I18nContextType {
  locale: Language;
  setLocale: (locale: Language) => void;
  t: (key: keyof TranslationKeys | string, params?: Record<string, any>) => string;
  loadTranslations: (locale: Language) => Promise<void>;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Load translations from JSON files
const loadTranslationFile = async (locale: Language): Promise<TranslationKeys> => {
  try {
    // Use NEXT_PUBLIC_BASE_PATH for GitHub Pages deployments
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
    const response = await fetch(`${basePath}/locales/${locale}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load translations for ${locale}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error loading translations for ${locale}:`, error);
    // Fallback to English if loading fails
    if (locale !== 'en') {
      return await loadTranslationFile('en');
    }
    // Return empty object as last resort
    return {} as TranslationKeys;
  }
};

// Parse nested keys like 'common.home' into object path
const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : '';
  }, obj);
};

// Replace placeholders in translation strings
const interpolate = (str: string, params?: Record<string, any>): string => {
  if (!params) return str;
  
  let result = str;
  Object.keys(params).forEach(key => {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), params[key]);
  });
  
  return result;
};

// Main Provider Component
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Language>('es'); // Default to Spanish
  const [translations, setTranslations] = useState<TranslationKeys>({} as TranslationKeys);

  // Load translations when locale changes
  useEffect(() => {
    const fetchTranslations = async () => {
      try {
        const loadedTranslations = await loadTranslationFile(locale);
        setTranslations(loadedTranslations);
      } catch (error) {
        console.error('Failed to load translations:', error);
      }
    };

    fetchTranslations();
  }, [locale]);

  const loadTranslations = async (newLocale: Language): Promise<void> => {
    try {
      const loadedTranslations = await loadTranslationFile(newLocale);
      setTranslations(loadedTranslations);
      setLocale(newLocale);
    } catch (error) {
      console.error('Failed to load translations:', error);
    }
  };

  // Translation function
  const t = (key: keyof TranslationKeys | string, params?: Record<string, any>): string => {
    // Handle nested keys like 'common.home'
    const value = getNestedValue(translations, key as string);
    
    if (typeof value === 'string') {
      return interpolate(value, params);
    } else if (Array.isArray(value)) {
      // If it's an array, join with commas (for features lists)
      return value.join(', ');
    } else if (typeof value === 'object' && value !== null) {
      // If it's an object, return the first string value or key as fallback
      return Object.values(value)[0] as string || key as string;
    }
    
    // Fallback to key itself if not found
    return key as string;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, loadTranslations }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

// Hook to get current locale
export function useLocale(): Language {
  const { locale } = useI18n();
  return locale;
}

// Hook to change locale
export function useSetLocale(): (locale: Language) => void {
  const { setLocale } = useI18n();
  return setLocale;
}