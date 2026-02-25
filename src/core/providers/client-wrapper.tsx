'use client';

import React from 'react';
import { I18nProvider } from '@/src/i18n/i18n';
import { AuthProvider } from '@/src/core/contexts/auth-context';
import { ShippingProvider } from '@/src/core/contexts/shipping-context';

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <AuthProvider>
        <ShippingProvider>
          {children}
        </ShippingProvider>
      </AuthProvider>
    </I18nProvider>
  );
}