'use client';

import { useRouter } from 'next/navigation';
import { MarketplaceView } from "@/components/marketplace-view";

export default function SheinMarketplacePage() {
  const router = useRouter();
  
  console.log('Shein marketplace page loaded');
  
  return <MarketplaceView store="shein" />;
}