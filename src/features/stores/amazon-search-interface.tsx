'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/shared/ui/button';
import { Input } from '@/src/shared/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/src/shared/ui/card';
import { Badge } from '@/src/shared/ui/badge';
import { Skeleton } from '@/src/shared/ui/skeleton';
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
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { amazonProductService, type AmazonProduct, type SearchFilters } from '@/src/lib/amazon-product-service';
import { productScraper, type Product as MockProduct } from '@/src/lib/product-scraper';

interface AmazonSearchInterfaceProps {
  initialSearch?: string;
  onProductSelect?: (product: AmazonProduct) => void;
}

export function AmazonSearchInterface({ 
  initialSearch = '',
  onProductSelect 
}: AmazonSearchInterfaceProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [products, setProducts] = useState<AmazonProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<AmazonProduct[]>([]);
  const [categories, setCategories] = useState<string[]>([
    'Electronics', 'Computers', 'Home & Kitchen', 
    'Sports & Outdoors', 'Toys & Games', 'Books'
  ]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    sortBy: 'popularity'
  });
  const [showWarning, setShowWarning] = useState(true);

  // Categories are hardcoded since Amazon API doesn't expose all categories directly

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
      // Use Amazon-specific product service
      const results = await amazonProductService.searchProducts(searchQuery, filters);
      setProducts(results);
      setFilteredProducts(results);
      setSelectedCategory(null); // Clear category filter when searching
    } catch (error) {
      console.error('Search error:', error);
      // Show error to user
    } finally {
      setSearchLoading(false);
    }
  };

  const handleProductSelect = (product: AmazonProduct) => {
    // Navigate to order creation with pre-filled product data
    const productData = {
      productName: product.name,
      productUrl: product.url,
      productPriceUSD: product.price.toString(),
      storeName: 'Amazon',
      imageUrl: product.imageUrl,
      description: product.description
    };
    
    // Store in session storage for the order form to access
    sessionStorage.setItem('selectedProduct', JSON.stringify(productData));
    
    // Call the callback if provided
    if (onProductSelect) {
      onProductSelect(product);
    }
    
    // Navigate to order page
    router.push('/pedido');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
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

  return (
    <div className="space-y-6">
      {/* Warning Banner */}
      {showWarning && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-yellow-800">Importante sobre búsquedas en Amazon</p>
              <p className="text-sm text-yellow-700 mt-1">
                Debido a las políticas de Amazon, algunas búsquedas pueden no devolver resultados exactos. 
                Nuestro sistema utiliza APIs alternativas para proporcionar información de productos similar a la de Amazon.
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowWarning(false)}
              className="text-yellow-700 hover:text-yellow-900 hover:bg-yellow-100"
            >
              Ocultar
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Search Section */}
      <Card className="p-6 bg-white/80 backdrop-blur">
        <div className="flex flex-col lg:flex-row gap-4 mb-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Buscar productos en Amazon (ej: bicicletas)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-20 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 transition-colors"
            />
            <Button 
              onClick={handleSearch}
              disabled={searchLoading}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600"
            >
              {searchLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        
        {/* Filters */}
        <div>
          <div className="flex flex-wrap gap-2">
            <select 
              value={filters.sortBy || ''}
              onChange={(e) => setFilters(f => ({ 
                ...f, 
                sortBy: e.target.value as SearchFilters['sortBy'] 
              }))}
              className="px-4 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="border-2 border-gray-300 hover:border-blue-500"
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
          Resultados de Amazon
        </div>
      </div>

      {/* Products Grid */}
      {searchLoading && (
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
      )}

      {!searchLoading && filteredProducts.length === 0 && products.length > 0 ? (
        <Card className="p-12 text-center">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No se encontraron productos coincidentes</h3>
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
      ) : !searchLoading && filteredProducts.length === 0 ? (
        <Card className="p-12 text-center">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">Buscar productos en Amazon</h3>
          <p className="text-gray-500 mb-6">
            Ingresa un término de búsqueda arriba para encontrar productos en Amazon
          </p>
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
                <h3 className="font-semibold text-gray-800 line-clamp-2 group-hover:text-blue-600 transition-colors">
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
              
              <CardFooter className="flex gap-2">
                <Button 
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(product.url, '_blank');
                  }}
                  variant="outline"
                  size="sm"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Ver en Amazon
                </Button>
                <Button 
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:scale-105 transition-all"
                  onClick={() => handleProductSelect(product)}
                  size="sm"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Añadir al carrito
                </Button>
              </CardFooter>
                        
              {/* Click anywhere on card to view details */}
              <button 
                className="absolute inset-0 w-full h-full opacity-0"
                onClick={() => {
                  // Navigate to product detail page
                  router.push(`/tienda/amazon/${product.asin}`);
                }}
                aria-label={`View details for ${product.name}`}
              />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}