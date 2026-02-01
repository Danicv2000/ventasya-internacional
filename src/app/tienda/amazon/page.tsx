'use client';

import { AmazonSearchInterface } from "@/src/features/stores/amazon-search-interface";


export default function AmazonMarketplacePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <AmazonSearchInterface />
      </div>
    </div>
  );
}