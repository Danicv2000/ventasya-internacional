'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Search, 
  Star, 
  ShoppingCart, 
  Filter,
  ArrowLeft,
  TrendingUp,
  Tag,
  Package,
  Truck,
  Sparkles
} from "lucide-react";
import { TemuIcon, SheinIcon, AmazonIcon } from "@/components/platform-icons";
import { productScraper, type Product, type SearchFilters } from "@/lib/product-scraper";
import { AIScrapingInterface } from "@/components/ai-scraping-interface";

interface MarketplaceViewProps {
  store: 'temu' | 'shein' | 'amazon';
}

export function MarketplaceView({ store }: MarketplaceViewProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'popularity'
  });
  const [showAIScraper, setShowAIScraper] = useState(false);
  const [aiScrapedProduct, setAiScrapedProduct] = useState<any>(null);

  // Get store display info
  const storeInfo = {
    temu: {
      name: "TEMU",
      icon: <TemuIcon className="w-32 h-20 md:w-40 md:h-24" />,
      description: "Descubre miles de productos con precios increíbles",
      color: "from-orange-400 to-red-500",
      bgColor: "from-orange-50 to-red-50"
    },
    shein: {
      name: "SHEIN",
      icon: <SheinIcon className="w-32 h-20 md:w-40 md:h-24" />,
      description: "Moda moderna y accesorios con las últimas tendencias",
      color: "from-pink-400 to-purple-500",
      bgColor: "from-pink-50 to-purple-50"
    },
    amazon: {
      name: "AMAZON",
      icon: <AmazonIcon className="w-32 h-20 md:w-40 md:h-24" />,
      description: "La mayor selección de productos de todas las categorías",
      color: "from-blue-400 to-cyan-500",
      bgColor: "from-blue-50 to-cyan-50"
    }
  };

  const currentStore = storeInfo[store];

  // Load initial data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load trending products
        const trendingProducts = await productScraper.getTrendingProducts(store);
        setProducts(trendingProducts);
        setFilteredProducts(trendingProducts);
        
        // Load categories
        const cats = await productScraper.getCategories(store);
        setCategories(cats);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [store]);

  // Apply filters when they change
  useEffect(() => {
    let result = [...products];
    
    // Apply category filter
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    // Apply price filters
    if (filters.minPrice) {
      result = result.filter(p => p.price >= filters.minPrice!);
    }
    if (filters.maxPrice) {
      result = result.filter(p => p.price <= filters.maxPrice!);
    }
    
    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price_low':
          result.sort((a, b) => a.price - b.price);
          break;
        case 'price_high':
          result.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'popularity':
          result.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
      }
    }
    
    setFilteredProducts(result);
  }, [products, selectedCategory, filters]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setSearchLoading(true);
    try {
      const results = await productScraper.searchProducts(searchQuery, store, filters);
      setProducts(results);
      setFilteredProducts(results);
      setSelectedCategory(null); // Clear category filter when searching
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleProductSelect = (product: Product) => {
    // Navigate to order creation with pre-filled product data
    const productData = {
      productName: product.name,
      productUrl: product.url,
      productPriceUSD: product.price.toString(),
      storeName: product.store.charAt(0).toUpperCase() + product.store.slice(1),
      imageUrl: product.imageUrl,
      description: product.description
    };
    
    // Store in session storage for the order form to access
    sessionStorage.setItem('selectedProduct', JSON.stringify(productData));
    
    // Navigate to order page
    router.push('/pedido');
  };

  const handleAIScrapedProduct = (productData: any) => {
    // Convert AI-scraped data to our format
    const convertedData = {
      productName: productData.name,
      productUrl: productData.url || '', // The URL that was scraped
      productPriceUSD: productData.price.replace(/[^\d.]/g, ''), // Extract numeric price
      storeName: 'Sitio Web Personalizado',
      imageUrl: productData.imageUrl || '',
      description: productData.description || productData.name
    };
    
    setAiScrapedProduct(convertedData);
    
    // Store in session storage
    sessionStorage.setItem('selectedProduct', JSON.stringify(convertedData));
    
    // Navigate to order page
    router.push('/pedido');
  };

  const formatPrice = (price: number, originalPrice?: number) => {
    if (originalPrice && originalPrice > price) {
      return (
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold text-green-600">${price.toFixed(2)}</span>
          <span className="text-sm text-gray-500 line-through">${originalPrice.toFixed(2)}</span>
          <Badge variant="destructive" className="text-xs">
            -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
          </Badge>
        </div>
      );
    }
    return <span className="text-lg font-bold">${price.toFixed(2)}</span>;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
          />
        ))}
        <span className="text-sm text-gray-600 ml-1">({rating})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto">
          {/* Loading header */}
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-12 w-40" />
            <Skeleton className="h-10 w-32" />
          </div>
          
          {/* Loading search */}
          <div className="mb-8">
            <Skeleton className="h-14 w-full max-w-2xl mx-auto" />
          </div>
          
          {/* Loading products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="w-full h-48" />
                <CardHeader>
                  <Skeleton className="h-4 w-3/4 mb-2" />
                  <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentStore.bgColor} p-4`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => router.back()}
              className="hover:bg-primary/10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            <div>
              <div className="flex items-center gap-3 mb-2">
                {currentStore.icon}
              </div>
              <p className="text-gray-600 text-lg">{currentStore.description}</p>
            </div>
          </div>
          
          <Button 
            onClick={() => router.push('/pedido')}
            className="bg-gradient-to-r from-primary to-accent hover:scale-105 transition-all"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Crear Pedido
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8 p-6 bg-white/80 backdrop-blur">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder={`Buscar productos en ${currentStore.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-20 py-3 text-lg border-2 border-gray-200 focus:border-primary transition-colors"
              />
              <Button 
                onClick={handleSearch}
                disabled={searchLoading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary hover:bg-primary/90"
              >
                {searchLoading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </Button>
            </div>
            
            {/* AI Scraper Toggle */}
            <Button 
              variant={showAIScraper ? "default" : "outline"}
              onClick={() => setShowAIScraper(!showAIScraper)}
              className="flex items-center gap-2 border-2"
            >
              <Sparkles className="h-5 w-5" />
              {showAIScraper ? "Cerrar Buscador AI" : "Usar Buscador AI"}
            </Button>
          </div>
          
          {/* AI Scraping Interface */}
          {showAIScraper && (
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border-2 border-purple-200">
              <AIScrapingInterface onProductScraped={handleAIScrapedProduct} />
            </div>
          )}
          
          {/* Filters */}
          <div>
            <div className="flex flex-wrap gap-2">
              <select 
                value={filters.sortBy || ''}
                onChange={(e) => setFilters(f => ({ 
                  ...f, 
                  sortBy: e.target.value as SearchFilters['sortBy'] 
                }))}
                className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Ordenar por...</option>
                <option value="popularity">Más populares</option>
                <option value="price_low">Precio: Menor a Mayor</option>
                <option value="price_high">Precio: Mayor a Menor</option>
                <option value="rating">Mejor calificados</option>
              </select>
              
              <Button 
                variant="outline" 
                size="icon"
                className="border-2 border-gray-300 hover:border-primary"
              >
                <Filter className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
            <Button
              variant={selectedCategory === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className="transition-all hover:scale-105"
            >
              Todas
            </Button>
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
                className="transition-all hover:scale-105"
              >
                {category}
              </Button>
            ))}
          </div>
        </Card>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Mostrando {filteredProducts.length} productos
            {selectedCategory && ` en "${selectedCategory}"`}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <TrendingUp className="h-4 w-4" />
            Productos más populares
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No se encontraron productos</h3>
            <p className="text-gray-500 mb-6">
              Intenta con otra búsqueda o cambia los filtros
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
                setFilters({ sortBy: 'popularity' });
              }}
            >
              Limpiar filtros
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id} 
                className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group"
              >
                {/* Product Image */}
                <div className="relative overflow-hidden">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {product.discount && (
                    <Badge className="absolute top-2 right-2 bg-red-500 text-white">
                      -{product.discount}%
                    </Badge>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>
                
                <CardHeader className="pb-2">
                  <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <Badge variant="secondary" className="text-xs w-fit">
                    {product.category}
                  </Badge>
                </CardHeader>
                
                <CardContent className="pb-3">
                  {/* Rating */}
                  <div className="mb-2">
                    {renderStars(product.rating)}
                    <span className="text-xs text-gray-500 ml-1">
                      ({product.reviewCount.toLocaleString()} reseñas)
                    </span>
                  </div>
                  
                  {/* Price */}
                  <div className="mb-3">
                    {formatPrice(product.price, product.originalPrice)}
                  </div>
                  
                  {/* Availability */}
                  <div className="flex items-center gap-1 text-sm">
                    <div className={`w-2 h-2 rounded-full ${
                      product.availability === 'in_stock' ? 'bg-green-500' :
                      product.availability === 'limited' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} />
                    <span className={`${
                      product.availability === 'in_stock' ? 'text-green-600' :
                      product.availability === 'limited' ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {product.availability === 'in_stock' ? 'En stock' :
                       product.availability === 'limited' ? 'Stock limitado' : 'Agotado'}
                    </span>
                  </div>
                  
                  {/* Shipping */}
                  <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                    <Truck className="h-3 w-3" />
                    <span>{product.shippingInfo}</span>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-primary to-accent hover:scale-105 transition-all"
                    onClick={() => handleProductSelect(product)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Comprar con EncargosYa
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}