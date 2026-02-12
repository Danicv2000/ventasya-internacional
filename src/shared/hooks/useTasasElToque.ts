import { useState, useEffect } from 'react';

interface TasasData {
  // Define the expected response structure here based on the API
  // Since the exact structure isn't provided, I'm using a generic structure
  [key: string]: any;
}

interface UseTasasOptions {
  dateFrom: string;
  dateTo: string;
}

export const useTasasElToque = (options?: UseTasasOptions) => {
  const [data, setData] = useState<TasasData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasas = async (dateFrom: string, dateTo: string) => {
    setLoading(true);
    setError(null);

    try {
      // Use the Next.js API route to avoid CORS issues
      const url = `/api/eltoque/tasas?date_from=${encodeURIComponent(dateFrom)}&date_to=${encodeURIComponent(dateTo)}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching tasas');
      console.error('Error fetching tasas from El Toque API:', err);
    } finally {
      setLoading(false);
    }
  };

  // If options are provided, fetch immediately
  useEffect(() => {
    if (options?.dateFrom && options.dateTo) {
      fetchTasas(options.dateFrom, options.dateTo);
    }
  }, []);

  // Auto-refresh every 15 minutes (900000 milliseconds)
  useEffect(() => {
    if (options?.dateFrom && options.dateTo) {
      const interval = setInterval(() => {
        fetchTasas(options.dateFrom, options.dateTo);
      }, 15 * 60 * 1000); // 15 minutes in milliseconds

      // Cleanup interval on component unmount
      return () => clearInterval(interval);
    }
  }, [options?.dateFrom, options?.dateTo]);

  // Method to manually trigger the fetch
  const refetch = (dateFrom?: string, dateTo?: string) => {
    const from = dateFrom || options?.dateFrom;
    const to = dateTo || options?.dateTo;

    if (from && to) {
      fetchTasas(from, to);
    } else {
      setError('Both dateFrom and dateTo are required for the API request');
    }
  };

  return { data, loading, error, refetch };
};

// Export for compatibility with the import structure
export default useTasasElToque;