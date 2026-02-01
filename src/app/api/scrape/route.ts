import { NextResponse } from 'next/server';
import { aiScraper } from '@/lib/ai-web-scraper';

export async function POST(request: Request) {
  try {
    const { url } = await request.json();
    
    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }
    
    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }
    
    console.log(`[API] Scraping URL: ${url}`);
    
    // Scrape the product
    const product = await aiScraper.scrapeProduct(url);
    
    if (!product) {
      return NextResponse.json(
        { error: 'Could not extract product information from the URL' },
        { status: 400 }
      );
    }
    
    console.log('[API] Product scraped successfully');
    
    return NextResponse.json({
      success: true,
      product: product
    });
    
  } catch (error) {
    console.error('[API] Scraping error:', error);
    return NextResponse.json(
      { error: 'Internal server error during scraping' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'AI Web Scraping API',
    description: 'Scrape product data from any website using AI',
    endpoint: 'POST /api/scrape',
    parameters: {
      url: 'The website URL to scrape'
    },
    example: {
      url: 'https://example-store.com/product/123'
    }
  });
}