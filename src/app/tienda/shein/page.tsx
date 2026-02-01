'use client';

import { MarketplaceView } from '@/src/features/stores/marketplace-view';
import { useRouter } from 'next/navigation';


export default function SheinMarketplacePage() {
  const router = useRouter();
  
  console.log('Shein marketplace page loaded');
  
  return <MarketplaceView store="shein" />;
}