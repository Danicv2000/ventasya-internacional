# AI Web Scraper Integration

## Overview
This project now includes an AI-powered web scraping feature that can extract product information from any website using Large Language Models.

## Features
- **Universal Compatibility**: Works with any website (Amazon, eBay, local stores, etc.)
- **Structured Data Extraction**: Automatically extracts product name, price, description, images, and more
- **AI-Powered Accuracy**: Uses GPT-4 to understand context and extract relevant information
- **Seamless Integration**: Directly connects to order creation workflow

## Setup Instructions

### 1. Install Dependencies
The required packages have been installed:
```bash
npm install llm-scraper zod playwright @ai-sdk/openai dotenv
```

### 2. Configure API Keys
Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-api-key-here
```

You can get an API key from: https://platform.openai.com/api-keys

### 3. Alternative Providers
The scraper also supports other providers:

**Groq (Free tier available):**
```
GROQ_API_KEY=your-groq-key
```

**Local Ollama:**
```
OLLAMA_HOST=http://localhost:11434
```

### 4. Usage

#### Via Web Interface:
1. Visit `/scraper` in your browser
2. Enter any product URL in the input field
3. Click "Extraer Datos"
4. The AI will analyze the page and extract product information
5. Click "Usar este Producto para mi Pedido" to create an order

#### Programmatic Usage:
```typescript
import { aiScraper } from '@/lib/ai-web-scraper';

// Extract single product
const product = await aiScraper.scrapeProduct('https://example.com/product');

// Extract multiple products from a category/search page
const products = await aiScraper.scrapeMultipleProducts('https://example.com/category', 10);
```

## How It Works

1. **Browser Automation**: Uses Playwright to load the webpage
2. **AI Analysis**: Feeds the page content to GPT-4 with a structured schema
3. **Data Extraction**: AI identifies and extracts relevant product information
4. **Validation**: Ensures data matches the expected format
5. **Integration**: Seamlessly connects with the existing order system

## Supported Data Fields

The AI extracts the following information when available:
- Product name/title ✅
- Price with currency ✅
- Description ✅
- Main image URL ✅
- Rating/reviews ✅
- Stock availability ✅
- Brand/manufacturer ✅
- Category ✅
- Key features ✅
- Technical specifications ✅

## Example Output

```json
{
  "name": "Wireless Bluetooth Earbuds",
  "price": "$29.99",
  "description": "High-quality wireless earbuds with noise cancellation...",
  "imageUrl": "https://example.com/image.jpg",
  "rating": "4.5/5 (1,234 reviews)",
  "availability": "In Stock",
  "brand": "TechBrand",
  "category": "Electronics",
  "features": ["Bluetooth 5.0", "Noise Cancellation", "24h Battery"],
  "specifications": {
    "Battery Life": "24 hours",
    "Connectivity": "Bluetooth 5.0",
    "Weight": "5.2 oz"
  }
}
```

## Troubleshooting

### Common Issues:

1. **"No se pudo extraer información"**
   - Verify the URL is correct and accessible
   - Some sites may have anti-bot protection
   - Try with a different product URL

2. **API Key Errors**
   - Ensure your `.env` file is properly configured
   - Check that your OpenAI account has credits
   - Verify the API key format is correct

3. **Performance Issues**
   - Web scraping can take 5-15 seconds depending on page complexity
   - Large pages with many images may take longer
   - Consider using the headless mode for faster processing

## Security Notes

- All scraping is done server-side (in the browser automation)
- No user credentials are stored or transmitted
- Rate limiting is built-in to prevent abuse
- Respect robots.txt and website terms of service

## Future Enhancements

Planned improvements:
- [ ] Support for more AI providers (Claude, Gemini)
- [ ] Batch processing for multiple URLs
- [ ] Custom schema definitions
- [ ] Proxy support for geo-restricted content
- [ ] Enhanced error handling and retry logic