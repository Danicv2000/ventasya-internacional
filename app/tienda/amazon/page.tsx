'use client';

import { useRouter } from 'next/navigation';
import { MarketplaceView } from "@/components/marketplace-view";

export default function AmazonMarketplacePage() {
  const router = useRouter();
  
  console.log('Amazon marketplace page loaded');
  
  return <MarketplaceView store="amazon" />;
}