'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/src/shared/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/src/shared/ui/card';
import { Badge } from '@/src/shared/ui/badge';
import { 
  Star, 
  ShoppingCart, 
  Truck,
  Shield,
  RotateCcw,
  ExternalLink
} from 'lucide-react';
import { amazonProductService, type AmazonProduct } from '@/lib/amazon-product-service';

export default function AmazonProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [product, setProduct] = useState<AmazonProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        // In a real implementation, we would fetch the specific product
        // For demo, we'll use the search function to get mock data
        const products = await amazonProductService.searchProducts('bicicleta', { maxResults: 5 });
        // Find a product that matches the ID or just pick the first one for demo
        const foundProduct = products.find(p => p.id === `amazon_bike_${id}`) || products.find(p => p.asin === id) || products[0];
        setProduct(foundProduct || null);
      } catch (error) {
        console.error('Error fetching product:', error);
        // If we can't find the specific product, try to get the first one
        const products = await amazonProductService.searchProducts('bicicleta', { maxResults: 5 });
        setProduct(products[0] || null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    // Prepare product data for the order form
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
    
    // Navigate to order page
    window.location.href = '/pedido';
  };

  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-300 rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-12 bg-gray-300 rounded w-1/3"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-full"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Producto no encontrado</h2>
          <p className="text-gray-500 mb-6">El producto que estás buscando no está disponible</p>
          <Button onClick={() => window.history.back()}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Volver atrás
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Image */}
            <div>
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="w-full h-96 object-contain rounded-xl"
              />
            </div>
            
            {/* Product Details */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {product.brand}
                  </Badge>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`w-5 h-5 ${star <= Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                      <span className="ml-2 text-gray-600">({product.reviewCount.toLocaleString()} reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="text-4xl font-bold text-green-600 mb-6">
                ${product.price.toFixed(2)}
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg text-gray-500 line-through ml-2">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
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
                
                <p className="text-gray-600">{product.shippingInfo}</p>
                
                {product.description && (
                  <p className="text-gray-700">{product.description}</p>
                )}
              </div>
              
              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border rounded-lg">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={decrementQuantity}
                    className="rounded-none border-0 rounded-l-lg"
                  >
                    -
                  </Button>
                  <span className="px-4 py-2">{quantity}</span>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={incrementQuantity}
                    className="rounded-none border-0 rounded-r-lg"
                  >
                    +
                  </Button>
                </div>
                
                <div className="text-sm text-gray-500">
                  Total: ${(product.price * quantity).toFixed(2)}
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-6 text-lg"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Añadir al Carrito con EncargosYa
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex-1 border-2 py-6 text-lg"
                  onClick={() => window.open(product.url, '_blank')}
                >
                  <ExternalLink className="mr-2 h-5 w-5" />
                  Ver en Amazon
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t">
                <div className="flex items-center text-sm text-gray-600">
                  <Shield className="h-4 w-4 mr-2 text-green-500" />
                  Compra segura
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Truck className="h-4 w-4 mr-2 text-blue-500" />
                  Envío internacional
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Features */}
          {product.features && product.features.length > 0 && (
            <CardHeader className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4">Características del producto</h2>
            </CardHeader>
          )}
          
          {product.features && (
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    </div>
                    <span className="ml-3 text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          )}
          
          {/* Specifications */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <CardHeader className="border-t pt-6">
              <h2 className="text-xl font-bold mb-4">Especificaciones</h2>
            </CardHeader>
          )}
          
          {product.specifications && (
            <CardContent className="pb-6">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="border rounded-lg p-3 text-center">
                    <div className="text-sm text-gray-500">{key}</div>
                    <div className="font-medium">{value}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}