'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/src/shared/ui/button";
import { Card, CardContent, CardHeader } from "@/src/shared/ui/card";
import { 
  ArrowLeft, 
  ShoppingBag, 
  Zap, 
  Globe,
  Package,
  Heart
} from "lucide-react";
import { TemuIcon, SheinIcon, AmazonIcon } from "@/src/features/common/platform-icons";
import { useI18n } from "@/src/hooks/use-i18n";

export default function StoreSelectionPage() {
  const { t } = useI18n();
  const router = useRouter();

  const stores = [
    {
      id: 'temu',
      name: t('stores.temu.name'),
      description: t('stores.temu.description'),
      icon: <TemuIcon className="w-32 h-20 md:w-40 md:h-24 mx-auto" />,
      gradient: "from-orange-400 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      features: [
        t('stores.temu.features.0'),
        t('stores.temu.features.1'),
        t('stores.temu.features.2')
      ]
    },
    {
      id: 'shein',
      name: t('stores.shein.name'),
      description: t('stores.shein.description'),
      icon: <SheinIcon className="w-32 h-20 md:w-40 md:h-24 mx-auto" />,
      gradient: "from-pink-400 to-purple-500",
      bgGradient: "from-pink-50 to-purple-50",
      features: [
        t('stores.shein.features.0'),
        t('stores.shein.features.1'),
        t('stores.shein.features.2')
      ]
    },
    {
      id: 'amazon',
      name: t('stores.amazon.name'),
      description: t('stores.amazon.description'),
      icon: <AmazonIcon className="w-32 h-20 md:w-40 md:h-24 mx-auto" />,
      gradient: "from-blue-400 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      features: [
        t('stores.amazon.features.0'),
        t('stores.amazon.features.1'),
        t('stores.amazon.features.2')
      ]
    }
  ];

  const handleStoreSelect = (storeId: string) => {
    // Navigate to the marketplace view for the selected store
    router.push(`/tienda/${storeId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/80 backdrop-blur-xl shadow-lg">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                <Package className="size-6 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/50 to-purple-600/50 rounded-xl blur-lg scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {t('common.app_name')}
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            <Link href="/calculadora">
              <Button variant="outline" className="hover:bg-blue-50">
                <Zap className="size-4 mr-2" />
                Calculadora
              </Button>
            </Link>
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="hover:bg-blue-50 rounded-xl">
                <Globe className="size-5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Back Button */}
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="hover:bg-primary/10"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
        </div>

        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6 animate-pulse">
            <ShoppingBag className="size-10 text-white" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            {t('stores.title')}
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('stores.description')}
          </p>
        </div>

        {/* Store Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {stores.map((store) => (
            <Card 
              key={store.id}
              className={`overflow-hidden group hover:shadow-2xl hover:scale-105 transition-all duration-500 cursor-pointer relative bg-gradient-to-br ${store.bgGradient} border-2 hover:border-opacity-50`}
              onClick={() => handleStoreSelect(store.id)}
            >
              {/* Hover overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${store.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
              
              <CardHeader className="text-center pb-6 relative z-10">
                <div className="mb-6 transform transition-transform duration-300 group-hover:scale-110 group-hover:-translate-y-2">
                  {store.icon}
                </div>

                <p className="text-gray-600 text-lg leading-relaxed">
                  {store.description}
                </p>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <div className="space-y-3 mb-6">
                  {store.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${store.gradient}`} />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className={`w-full bg-gradient-to-r ${store.gradient} hover:shadow-lg hover:scale-105 transition-all duration-300 py-6 text-lg font-semibold group-hover:from-white group-hover:to-white group-hover:text-gray-800 group-hover:border-2 group-hover:border-current`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStoreSelect(store.id);
                  }}
                >
                  <ShoppingBag className="mr-2 h-5 w-5 group-hover:text-gray-800 transition-colors" />
                  {t('stores.explore', { store: store.name })}
                </Button>
              </CardContent>
              
              {/* Decorative elements */}
              <div className="absolute top-4 right-4 text-6xl opacity-5 group-hover:opacity-10 transition-opacity">
                <Heart className="text-pink-400" />
              </div>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-white/50 backdrop-blur rounded-3xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('common.why_us')}
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Zap className="size-8 text-blue-500" />,
                title: t('common.smart_shopping'),
                description: t('common.shop_real_stores')
              },
              {
                icon: <Globe className="size-8 text-purple-500" />,
                title: t('common.global_access'),
                description: t('common.access_global_products')
              },
              {
                icon: <Package className="size-8 text-green-500" />,
                title: t('common.safe_delivery'),
                description: t('common.receive_in_cuba')
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-gray-600">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-gray-600 mb-6 text-lg">
            {t('common.prefer_calculate_first')}
          </p>
          <Link href="/calculadora">
            <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
              <Zap className="size-5 mr-3" />
              {t('navigation.calculator')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}