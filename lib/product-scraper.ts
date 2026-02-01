// AI-Powered Product Scraper Service
// Simulates real marketplace product search and browsing experience

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  description: string;
  category: string;
  brand: string;
  availability: 'in_stock' | 'limited' | 'out_of_stock';
  shippingInfo: string;
  discount?: number;
  url: string;
  store: 'temu' | 'shein' | 'amazon';
}

interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  rating?: number;
  sortBy?: 'price_low' | 'price_high' | 'rating' | 'popularity';
}

// Mock product database - In a real implementation, this would connect to actual APIs
const MOCK_PRODUCTS: Record<string, Product[]> = {
  temu: [
    {
      id: 'temu_001',
      name: 'Wireless Bluetooth Earbuds with Charging Case',
      price: 12.99,
      originalPrice: 29.99,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop',
      rating: 4.5,
      reviewCount: 12847,
      description: 'High-quality wireless earbuds with noise cancellation and 30-hour battery life',
      category: 'Electronics',
      brand: 'Generic',
      availability: 'in_stock',
      shippingInfo: 'Free shipping over $15',
      discount: 57,
      url: 'https://www.temu.com/product/earbuds-001',
      store: 'temu'
    },
    {
      id: 'temu_002',
      name: 'Smart Fitness Tracker Watch',
      price: 19.99,
      originalPrice: 49.99,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop',
      rating: 4.3,
      reviewCount: 8932,
      description: 'Waterproof fitness tracker with heart rate monitor and sleep tracking',
      category: 'Electronics',
      brand: 'Generic',
      availability: 'in_stock',
      shippingInfo: 'Free shipping',
      discount: 60,
      url: 'https://www.temu.com/product/fitness-watch-001',
      store: 'temu'
    },
    {
      id: 'temu_003',
      name: 'Stainless Steel Water Bottle 32oz',
      price: 8.99,
      originalPrice: 19.99,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop',
      rating: 4.7,
      reviewCount: 15623,
      description: 'Double wall insulated water bottle keeps drinks cold for 24 hours',
      category: 'Home & Kitchen',
      brand: 'Generic',
      availability: 'limited',
      shippingInfo: '$2.99 shipping',
      discount: 55,
      url: 'https://www.temu.com/product/water-bottle-001',
      store: 'temu'
    }
  ],
  shein: [
    {
      id: 'shein_001',
      name: 'Summer Floral Print Maxi Dress',
      price: 15.99,
      originalPrice: 32.99,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=400&fit=crop',
      rating: 4.6,
      reviewCount: 23456,
      description: 'Flowy maxi dress with vibrant floral print, perfect for summer occasions',
      category: 'Women\'s Clothing',
      brand: 'SHEIN',
      availability: 'in_stock',
      shippingInfo: 'Free standard shipping',
      discount: 52,
      url: 'https://www.shein.com/product/dress-001',
      store: 'shein'
    },
    {
      id: 'shein_002',
      name: 'High Waist Mom Jeans',
      price: 18.99,
      originalPrice: 29.99,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop',
      rating: 4.4,
      reviewCount: 18765,
      description: 'Comfortable high waist jeans with stretch fabric and trendy fit',
      category: 'Women\'s Clothing',
      brand: 'SHEIN',
      availability: 'in_stock',
      shippingInfo: 'Free shipping over $25',
      discount: 37,
      url: 'https://www.shein.com/product/jeans-001',
      store: 'shein'
    },
    {
      id: 'shein_003',
      name: 'Chunky Knit Sweater Vest',
      price: 12.99,
      originalPrice: 24.99,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop',
      rating: 4.2,
      reviewCount: 9876,
      description: 'Cozy knit vest perfect for layering, available in multiple colors',
      category: 'Women\'s Clothing',
      brand: 'SHEIN',
      availability: 'limited',
      shippingInfo: '$3.99 shipping',
      discount: 48,
      url: 'https://www.shein.com/product/sweater-001',
      store: 'shein'
    }
  ],
  amazon: [
    {
      id: 'amazon_001',
      name: 'Echo Dot (5th Gen) Smart Speaker',
      price: 49.99,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1611581212317-20ef1e467519?w=400&h=400&fit=crop',
      rating: 4.7,
      reviewCount: 87654,
      description: 'Premium smart speaker with Alexa voice control and improved sound quality',
      category: 'Electronics',
      brand: 'Amazon',
      availability: 'in_stock',
      shippingInfo: 'FREE delivery',
      url: 'https://www.amazon.com/product/echo-dot-5th-gen',
      store: 'amazon'
    },
    {
      id: 'amazon_002',
      name: 'Kindle Paperwhite (8GB)',
      price: 139.99,
      originalPrice: 149.99,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1531167248448-98ce736ea0be?w=400&h=400&fit=crop',
      rating: 4.8,
      reviewCount: 65432,
      description: 'Waterproof e-reader with adjustable warm light and weeks of battery life',
      category: 'Electronics',
      brand: 'Amazon',
      availability: 'in_stock',
      shippingInfo: 'FREE delivery',
      discount: 7,
      url: 'https://www.amazon.com/product/kindle-paperwhite',
      store: 'amazon'
    },
    {
      id: 'amazon_003',
      name: 'Instant Pot Duo 7-in-1 Electric Pressure Cooker',
      price: 89.99,
      originalPrice: 119.99,
      currency: 'USD',
      imageUrl: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
      rating: 4.6,
      reviewCount: 123456,
      description: 'Multi-functional kitchen appliance that pressure cooks, slow cooks, sautés and more',
      category: 'Home & Kitchen',
      brand: 'Instant Pot',
      availability: 'in_stock',
      shippingInfo: 'FREE delivery',
      discount: 25,
      url: 'https://www.amazon.com/product/instant-pot-duo',
      store: 'amazon'
    }
  ]
};

class ProductScraperService {
  private static instance: ProductScraperService;

  private constructor() {}

  public static getInstance(): ProductScraperService {
    if (!ProductScraperService.instance) {
      ProductScraperService.instance = new ProductScraperService();
    }
    return ProductScraperService.instance;
  }

  /**
   * Simulate AI-powered product search
   * @param query Search query
   * @param store Store to search in
   * @param filters Optional filters
   * @returns Array of products
   */
  async searchProducts(
    query: string, 
    store: 'temu' | 'shein' | 'amazon',
    filters?: SearchFilters
  ): Promise<Product[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 700));
    
    let products = [...MOCK_PRODUCTS[store]];
    
    // Filter by query (simple text matching)
    if (query) {
      const searchTerm = query.toLowerCase();
      products = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply filters
    if (filters) {
      if (filters.minPrice) {
        products = products.filter(p => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice) {
        products = products.filter(p => p.price <= filters.maxPrice!);
      }
      if (filters.rating) {
        products = products.filter(p => p.rating >= filters.rating!);
      }
      if (filters.category) {
        products = products.filter(p => 
          p.category.toLowerCase().includes(filters.category!.toLowerCase())
        );
      }
      if (filters.brand) {
        products = products.filter(p => 
          p.brand.toLowerCase().includes(filters.brand!.toLowerCase())
        );
      }
    }
    
    // Sort results
    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case 'price_low':
          products.sort((a, b) => a.price - b.price);
          break;
        case 'price_high':
          products.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          products.sort((a, b) => b.rating - a.rating);
          break;
        case 'popularity':
          products.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
      }
    }
    
    return products;
  }

  /**
   * Get trending products for a store
   */
  async getTrendingProducts(store: 'temu' | 'shein' | 'amazon'): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 500));
    const products = [...MOCK_PRODUCTS[store]];
    return products.sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 12);
  }

  /**
   * Get product categories for a store
   */
  async getCategories(store: 'temu' | 'shein' | 'amazon'): Promise<string[]> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const products = MOCK_PRODUCTS[store];
    const categories = [...new Set(products.map(p => p.category))];
    return categories;
  }

  /**
   * Get product details by ID
   */
  async getProductById(id: string): Promise<Product | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    for (const store in MOCK_PRODUCTS) {
      const product = MOCK_PRODUCTS[store as keyof typeof MOCK_PRODUCTS].find(p => p.id === id);
      if (product) return product;
    }
    
    return null;
  }

  /**
   * Simulate "customers also bought" recommendations
   */
  async getRelatedProducts(productId: string): Promise<Product[]> {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const product = await this.getProductById(productId);
    if (!product) return [];
    
    const storeProducts = MOCK_PRODUCTS[product.store];
    return storeProducts
      .filter(p => p.id !== productId && p.category === product.category)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
  }
}

// Export singleton instance
export const productScraper = ProductScraperService.getInstance();

// Export types
export type { Product, SearchFilters };