'use client';

import { useRouter } from 'next/navigation';
import { MarketplaceView } from "@/components/marketplace-view";

export default function TemuMarketplacePage() {
  const router = useRouter();
  
  console.log('Temu marketplace page loaded');
  
  return <MarketplaceView store="temu" />;
}