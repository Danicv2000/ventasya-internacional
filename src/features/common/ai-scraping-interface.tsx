'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  Search, 
  Sparkles, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import type { ProductData } from "@/lib/ai-web-scraper";

interface AIScrapingInterfaceProps {
  onProductScraped?: (product: ProductData) => void;
}

export function AIScrapingInterface({ onProductScraped }: AIScrapingInterfaceProps) {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedProduct, setScrapedProduct] = useState<ProductData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scrapingHistory, setScrapingHistory] = useState<{url: string, timestamp: Date}[]>([]);

  const handleScrape = async () => {
    if (!url.trim()) {
      setError("Por favor ingresa una URL válida");
      return;
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      setError("URL inválida. Por favor ingresa una URL completa (ej: https://...)");
      return;
    }

    setIsLoading(true);
    setError(null);
    setScrapedProduct(null);

    try {
      console.log(`[AI Interface] Scraping URL: ${url}`);
      
      // Call the scraping API
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });
      
      const result = await response.json();
      
      if (result.success && result.product) {
        const product = result.product;
        setScrapedProduct(product);
        setScrapingHistory(prev => [...prev, { url, timestamp: new Date() }]);
        
        // Notify parent component
        if (onProductScraped) {
          onProductScraped(product);
        }
        
        console.log('[AI Interface] Product scraped successfully:', product);
      } else {
        setError(result.error || "No se pudo extraer información del producto. Verifica que la URL sea correcta.");
      }
    } catch (err) {
      console.error('[AI Interface] Scraping error:', err);
      setError("Error al procesar la página. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseProduct = () => {
    if (scrapedProduct && onProductScraped) {
      onProductScraped(scrapedProduct);
    }
  };

  const formatPrice = (price: string) => {
    // Extract numeric value and format nicely
    const numericValue = price.replace(/[^\d.,]/g, '');
    return `$${numericValue}`;
  };

  return (
    <div className="space-y-6">
      {/* URL Input Section */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Globe className="h-6 w-6 text-blue-600" />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Buscador AI-Powered
            </span>
          </CardTitle>
          <p className="text-gray-600">
            Ingresa la URL de cualquier producto y nuestra IA lo analizará automáticamente
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="url"
                placeholder="https://www.ejemplo.com/producto..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError(null);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleScrape()}
                className="pl-10 py-3 text-lg border-2 border-gray-300 focus:border-blue-500"
                disabled={isLoading}
              />
            </div>
            
            <Button 
              onClick={handleScrape}
              disabled={isLoading || !url.trim()}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analizando...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Extraer Datos
                </>
              )}
            </Button>
          </div>
          
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <span>Funciona con cualquier sitio web - nuestra IA extrae automáticamente la información del producto</span>
          </div>
        </CardContent>
      </Card>

      {/* Scraped Product Display */}
      {scrapedProduct && (
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 animate-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <span className="text-green-800">Producto Encontrado</span>
              <Badge variant="secondary" className="ml-auto bg-green-100 text-green-800">
                Extraído por IA
              </Badge>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Product Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {scrapedProduct.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-green-600">
                      {formatPrice(scrapedProduct.price)}
                    </span>
                    {scrapedProduct.rating && (
                      <Badge variant="outline" className="text-sm">
                        ⭐ {scrapedProduct.rating}
                      </Badge>
                    )}
                  </div>
                </div>
                
                {scrapedProduct.description && (
                  <div className="bg-white/50 p-4 rounded-lg">
                    <p className="text-gray-700">{scrapedProduct.description}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {scrapedProduct.brand && (
                    <div className="bg-blue-100 p-2 rounded">
                      <span className="font-semibold text-blue-800">Marca:</span>
                      <p className="text-blue-700">{scrapedProduct.brand}</p>
                    </div>
                  )}
                  {scrapedProduct.category && (
                    <div className="bg-purple-100 p-2 rounded">
                      <span className="font-semibold text-purple-800">Categoría:</span>
                      <p className="text-purple-700">{scrapedProduct.category}</p>
                    </div>
                  )}
                  {scrapedProduct.availability && (
                    <div className="bg-yellow-100 p-2 rounded col-span-2">
                      <span className="font-semibold text-yellow-800">Disponibilidad:</span>
                      <p className="text-yellow-700">{scrapedProduct.availability}</p>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Product Image */}
              {scrapedProduct.imageUrl && (
                <div className="flex flex-col items-center">
                  <div className="bg-white border-2 border-gray-200 rounded-xl p-4 shadow-lg">
                    <img 
                      src={scrapedProduct.imageUrl} 
                      alt={scrapedProduct.name}
                      className="max-w-full h-64 object-contain rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={() => window.open(url, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Ver Producto Original
                  </Button>
                </div>
              )}
            </div>
            
            {/* Features */}
            {scrapedProduct.features && scrapedProduct.features.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Características:</h4>
                <div className="flex flex-wrap gap-2">
                  {scrapedProduct.features.map((feature, index) => (
                    <Badge key={index} variant="secondary" className="bg-gray-100">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* Specifications */}
            {scrapedProduct.specifications && Object.keys(scrapedProduct.specifications).length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Especificaciones:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {Object.entries(scrapedProduct.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between bg-white/50 p-2 rounded">
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button 
                onClick={handleUseProduct}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 flex-1 py-3"
                size="lg"
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                Usar este Producto para mi Pedido
              </Button>
              
              <Button 
                variant="outline" 
                onClick={() => setScrapedProduct(null)}
                className="flex-1 py-3"
                size="lg"
              >
                <Search className="mr-2 h-5 w-5" />
                Buscar Otro Producto
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Searches */}
      {scrapingHistory.length > 0 && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Search className="h-5 w-5" />
              Búsquedas Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {scrapingHistory.slice(-5).reverse().map((item, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                  <span className="text-sm text-gray-600 truncate flex-1 mr-2">
                    {item.url}
                  </span>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {item.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}