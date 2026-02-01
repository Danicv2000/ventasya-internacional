'use client';

import React from 'react';
import { I18nProvider } from '@/src/i18n/i18n';
import { AuthProvider } from '@/contexts/auth-context';
import { ShippingProvider } from '@/contexts/shipping-context';

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ShippingProvider>
        {children}
      </ShippingProvider>
    </AuthProvider>
  );
}