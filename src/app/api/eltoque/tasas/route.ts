import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('date_from') || '';
    const dateTo = searchParams.get('date_to') || '';

    // Validate required parameters
    if (!dateFrom || !dateTo) {
      return Response.json(
        { error: 'date_from and date_to parameters are required' },
        { status: 400 }
      );
    }

    const token = process.env.NEXT_PUBLIC_ELTOQUE_API_TOKEN;
    
    if (!token) {
      return Response.json(
        { error: 'El Toque API token is not configured in environment variables' },
        { status: 500 }
      );
    }

    // Construct the API URL
    const apiUrl = `https://tasas.eltoque.com/v1/trmi?date_from=${encodeURIComponent(dateFrom)}&date_to=${encodeURIComponent(dateTo)}`;

    // Make the request to El Toque API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // Don't cache this response in production
      next: { revalidate: 0 }
    });

    if (!response.ok) {
      return Response.json(
        { error: `API request failed with status ${response.status}: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Return the data with appropriate headers to prevent CORS issues
    return Response.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error: any) {
    console.error('Error in El Toque API route:', error);
    return Response.json(
      { error: 'An error occurred while fetching data from El Toque API' },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return Response.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}