// AI-Powered Web Scraping Service
// Uses Groq API for AI-powered scraping without heavy browser dependencies

import { z } from "zod";
import { createOpenAI } from "@ai-sdk/openai";
import * as cheerio from "cheerio";

// Configure Groq API
const groq = createOpenAI({
  baseURL: process.env.OPENAI_BASE_URL,
  apiKey: process.env.OPENAI_API_KEY,
});

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
});

type ProductData = z.infer<typeof ProductSchema>;

class AIWebScraperService {
  private static instance: AIWebScraperService;
  private llm: any;

  private constructor() {
    // Initialize Groq LLM
    this.llm = groq("llama3-8b-8192"); // Using llama3 for cost efficiency
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
    try {
      console.log(`[AI Scraper] Starting scrape for: ${url}`);
      
      // Fetch the webpage content
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch URL: ${response.status}`);
      }
      
      const html = await response.text();
      
      // Parse HTML with Cheerio
      const $ = cheerio.load(html);
      
      // Extract key information
      const title = $('title').text() || $('h1').first().text() || '';
      const metaDescription = $('meta[name="description"]').attr('content') || '';
      
      // Prepare prompt for AI analysis
      const prompt = `
      Analyze this webpage content and extract product information:
      
      Title: ${title}
      Description: ${metaDescription}
      URL: ${url}
      
      Content excerpt:
      ${$('body').text().substring(0, 2000)}
      
      Please extract the following information in JSON format:
      - name: Product name/title
      - price: Product price with currency
      - description: Product description
      - imageUrl: Main product image URL
      - rating: Product rating/reviews
      - availability: Stock status
      - brand: Product brand
      - category: Product category
      
      Return only valid JSON, no other text.
      `;
      
      // Use Groq AI to extract structured data
      const result = await this.llm.doGenerate({
        inputFormat: 'prompt',
        mode: { type: 'regular' },
        prompt,
      });
      
      if (result.text) {
        try {
          const jsonData = JSON.parse(result.text);
          const parsed = ProductSchema.parse(jsonData);
          console.log('[AI Scraper] Successfully extracted product data');
          return parsed;
        } catch (parseError) {
          console.error('[AI Scraper] Failed to parse AI response:', parseError);
          // Return basic extracted data
          return {
            name: title || "Product name not found",
            price: "Price not available",
            description: metaDescription || "No description available",
            imageUrl: "",
            rating: "",
            availability: "Unknown",
            brand: "Unknown",
            category: "General"
          };
        }
      }
      
      return null;
      
    } catch (error) {
      console.error('[AI Scraper] Error scraping product:', error);
      return null;
    }
  }

  /**
   * Validate and clean scraped product data
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
      product.imageUrl = "";
    }
    
    // Ensure required fields
    if (!product.name) product.name = "Product name not found";
    if (!product.price) product.price = "Price not available";
    
    return product;
  }

  /**
   * Format product data for display
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