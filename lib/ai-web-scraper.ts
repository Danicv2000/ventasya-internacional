// AI-Powered Web Scraping Service
// Uses llm-scraper to extract product information from any website

import { z } from "zod";
import { chromium } from "playwright";
import LLMScraper from "llm-scraper";
import { openai } from "@ai-sdk/openai";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Define the product schema for extraction
const ProductSchema = z.object({
  name: z.string().describe("Product name/title"),
  price: z.string().describe("Product price with currency symbol"),
  description: z.string().optional().describe("Product description"),
  imageUrl: z.string().optional().describe("Main product image URL"),
  rating: z.string().optional().describe("Product rating/reviews"),
  availability: z.string().optional().describe("Stock status"),
  brand: z.string().optional().describe("Product brand/manufacturer"),
  category: z.string().optional().describe("Product category"),
  features: z.array(z.string()).optional().describe("Key product features"),
  specifications: z.record(z.string()).optional().describe("Technical specifications"),
});

type ProductData = z.infer<typeof ProductSchema>;

class AIWebScraperService {
  private static instance: AIWebScraperService;
  private llm: any;

  private constructor() {
    // Initialize OpenAI LLM
    this.llm = openai.chat("gpt-4o-mini"); // Using gpt-4o-mini for cost efficiency
  }

  public static getInstance(): AIWebScraperService {
    if (!AIWebScraperService.instance) {
      AIWebScraperService.instance = new AIWebScraperService();
    }
    return AIWebScraperService.instance;
  }

  /**
   * Scrape product information from any website URL
   * @param url The website URL to scrape
   * @returns Extracted product data or null if failed
   */
  async scrapeProduct(url: string): Promise<ProductData | null> {
    let browser;
    try {
      console.log(`[AI Scraper] Starting scrape for: ${url}`);
      
      // Launch browser
      browser = await chromium.launch({
        headless: true, // Set to false for debugging
      });
      
      const page = await browser.newPage();
      
      // Set realistic browser headers
      await page.setExtraHTTPHeaders({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      });
      
      // Navigate to the page
      console.log('[AI Scraper] Navigating to page...');
      await page.goto(url, { 
        waitUntil: 'networkidle', 
        timeout: 30000 
      });
      
      // Wait for page to load completely
      await page.waitForTimeout(2000);
      
      // Initialize LLM scraper
      const scraper = new LLMScraper(this.llm);
      
      // Extract product data using AI
      console.log('[AI Scraper] Extracting product data with AI...');
      const result = await scraper.run(page, ProductSchema, {
        format: 'html'
      });
      
      await page.close();
      
      console.log('[AI Scraper] Successfully extracted product data');
      return result.data[0] || null; // Return the first result object
      
    } catch (error) {
      console.error('[AI Scraper] Error scraping product:', error);
      return null;
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  /**
   * Scrape multiple products from search results or category pages
   * @param url The search/category page URL
   * @param maxProducts Maximum number of products to extract
   * @returns Array of product data
   */
  async scrapeMultipleProducts(url: string, maxProducts: number = 10): Promise<ProductData[]> {
    let browser;
    try {
      console.log(`[AI Scraper] Starting multi-product scrape for: ${url}`);
      
      browser = await chromium.launch({ headless: true });
      const page = await browser.newPage();
      
      await page.setExtraHTTPHeaders({
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      });
      
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
      await page.waitForTimeout(2000);
      
      const scraper = new LLMScraper(this.llm);
      
      // Schema for multiple products
      const ProductsSchema = z.object({
        products: z.array(ProductSchema).max(maxProducts)
      });
      
      const result = await scraper.run(page, ProductsSchema, {
        format: 'html'
      });
      
      await page.close();
      
      console.log(`[AI Scraper] Successfully extracted ${result.data.length} products`);
      return result.data[0]?.products || []; // Return the products array from the first result
      
    } catch (error) {
      console.error('[AI Scraper] Error scraping multiple products:', error);
      return [];
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  }

  /**
   * Validate and clean scraped product data
   * @param product Raw scraped product data
   * @returns Cleaned and validated product data
   */
  cleanProductData(product: any): ProductData {
    // Clean price (extract numeric value)
    if (product.price) {
      const priceMatch = product.price.match(/[\d,]+\.?\d*/);
      if (priceMatch) {
        product.price = `$${priceMatch[0]}`;
      }
    }
    
    // Clean image URLs
    if (product.imageUrl && !product.imageUrl.startsWith('http')) {
      product.imageUrl = null;
    }
    
    // Ensure required fields
    if (!product.name) product.name = "Product name not found";
    if (!product.price) product.price = "Price not available";
    
    return product;
  }

  /**
   * Format product data for display
   * @param product Product data
   * @returns Formatted string
   */
  formatProductForDisplay(product: ProductData): string {
    let output = `**${product.name}**\n`;
    output += `💰 ${product.price}\n`;
    
    if (product.brand) output += `🏷️ Brand: ${product.brand}\n`;
    if (product.category) output += `📂 Category: ${product.category}\n`;
    if (product.rating) output += `⭐ Rating: ${product.rating}\n`;
    if (product.availability) output += `📦 Availability: ${product.availability}\n`;
    if (product.description) output += `\n📝 Description: ${product.description.substring(0, 200)}...\n`;
    
    return output;
  }
}

// Export singleton instance
export const aiScraper = AIWebScraperService.getInstance();

// Export types
export type { ProductData };