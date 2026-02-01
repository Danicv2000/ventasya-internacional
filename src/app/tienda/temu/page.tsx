'use client';

import { MarketplaceView } from '@/src/features/stores/marketplace-view';
import { useRouter } from 'next/navigation';


export default function TemuMarketplacePage() {
  const router = useRouter();
  
  console.log('Temu marketplace page loaded');
  
  return <MarketplaceView store="temu" />;
}