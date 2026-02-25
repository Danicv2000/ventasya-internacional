// Server-side utility to fetch exchange rates
export async function getExchangeRates(
    dateFrom: string = `${new Date().toISOString().split('T')[0]} 00:00:01`, 
    dateTo: string = `${new Date().toISOString().split('T')[0]} 23:59:01`
) {
  try {
    const token = process.env.NEXT_PUBLIC_ELTOQUE_API_TOKEN;
    
    if (!token) {
      console.error('El Toque API token is not configured in environment variables');
      return null;
    }

    // Call the external API directly from server
    const response = await fetch(`https://tasas.eltoque.com/v1/trmi?date_from=${encodeURIComponent(dateFrom)}&date_to=${encodeURIComponent(dateTo)}`, {
      method: 'GET',
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      // Cache for 15 minutes to reduce API calls
      next: { revalidate: 900 } // 15 minutes in seconds
    });

    if (!response.ok) {
      console.error(`API request failed with status ${response.status}: ${response.statusText}`);
      return null;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    return null;
  }
}