'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/src/shared/ui/input';
import { Button } from '@/src/shared/ui/button';
import { Card } from '@/src/shared/ui/card';
import { Search, ShoppingCart, Bike, Monitor, Shirt, Gamepad2 } from 'lucide-react';
import { amazonProductService } from '@/src/lib/amazon-product-service';

interface UniversalSearchBarProps {
  placeholder?: string;
  autoFocus?: boolean;
  onSearch?: (query: string, results: any[]) => void;
  showSuggestions?: boolean;
}

export function UniversalSearchBar({
  placeholder = 'Buscar productos en Amazon...',
  autoFocus = false,
  onSearch,
  showSuggestions = true
}: UniversalSearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const popularSearches = [
    { term: 'bicicletas', icon: Bike, category: 'Sports & Outdoors' },
    { term: 'laptops', icon: Monitor, category: 'Electronics' },
    { term: 'ropa', icon: Shirt, category: 'Clothing' },
    { term: 'juguetes', icon: Gamepad2, category: 'Toys & Games' },
  ];

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setShowDropdown(true);

    try {
      // Search across all platforms (currently Amazon, but could be expanded)
      const results = await amazonProductService.searchProducts(query, { maxResults: 5 });
      setSearchResults(results);
      
      if (onSearch) {
        onSearch(query, results);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    setTimeout(() => handleSearch(), 100); // Small delay to update the query first
  };

  const handleProductClick = (product: any) => {
    // Navigate to the product detail page
    router.push(`/tienda/amazon/${product.asin}`);
    setShowDropdown(false);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => showSuggestions && setShowDropdown(true)}
          autoFocus={autoFocus}
          className="pl-10 pr-24 py-3 text-lg border-2 border-gray-200 focus:border-blue-500 transition-colors"
        />
        <Button 
          onClick={handleSearch}
          disabled={isSearching}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 hover:bg-blue-600"
        >
          {isSearching ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Search className="h-5 w-5" />
          )}
        </Button>
      </div>

      {(showDropdown || searchResults.length > 0) && (
        <Card className="absolute top-full left-0 right-0 mt-2 z-50 shadow-xl max-h-96 overflow-y-auto">
          {searchResults.length > 0 ? (
            <div className="divide-y">
              {searchResults.map((product, index) => (
                <div 
                  key={`${product.id}-${index}`} 
                  className="p-3 hover:bg-gray-50 cursor-pointer flex items-start gap-3"
                  onClick={() => handleProductClick(product)}
                >
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-12 h-12 object-contain rounded"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder-image.jpg'; // fallback image
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                    <p className="text-sm text-gray-500 truncate">${product.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {product.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        ⭐ {product.rating} ({product.reviewCount})
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : showSuggestions && query.length === 0 ? (
            <div className="p-4">
              <h3 className="font-medium text-gray-900 mb-3">Búsquedas populares</h3>
              <div className="flex flex-wrap gap-2">
                {popularSearches.map((search, index) => {
                  const IconComponent = search.icon;
                  return (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => handleSuggestionClick(search.term)}
                    >
                      <IconComponent className="h-4 w-4" />
                      {search.term}
                    </Button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No se encontraron productos</h3>
              <p className="text-gray-500">Intenta con otro término de búsqueda</p>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}