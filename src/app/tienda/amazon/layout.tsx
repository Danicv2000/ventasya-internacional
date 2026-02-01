import { AmazonSearchInterface } from '@/src/features/stores/amazon-search-interface';

export default function AmazonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {children}
    </div>
  );
}