import { useState, useEffect, useCallback } from 'react';

export interface TasasData {
  tasas?: {
    USD?: number;
    ECU?: number;
    BNB?: number;
    MLC?: number;
    BTC?: number;
    USDT_TRC20?: number;
    TRX?: number;
    [key: string]: number | undefined;
  };
  date?: string;
  hour?: number;
  minutes?: number;
  seconds?: number;
  [key: string]: any;
}

export interface UseExchangeRateOptions {
  fallbackRate?: number;
  refreshInterval?: number;
}

export interface UseExchangeRateReturn {
  exchangeRate: number;
  exchangeRates: TasasData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  calculateCUP: (amountUSD: number) => number;
  calculateCUPWithCosts: (amountUSD: number, weightCost: number, feePercentage?: number) => number;
  calculateTotalCost: (priceUSD: number, packageWeight: number, paymentMethod: string) => number;
}

/**
 * Hook para obtener tasas de cambio de la API de El Toque
 * Usa la ruta API interna para evitar CORS
 */
export function useTasasElToque() {
  const [data, setData] = useState<TasasData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasas = async () => {
    setLoading(true);
    setError(null);

    try {
      // Las fechas se generan automáticamente en la ruta API
      const url = '/api/eltoque/tasas';
      //console.log('[useTasasElToque] URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || `API request failed: ${response.status}`);
      }

      const result = await response.json();
      console.log('[useTasasElToque] Datos recibidos:', result);
      setData(result);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching tasas');
    } finally {
      setLoading(false);
    }
  };

  // Fetch immediately on mount
  useEffect(() => {
    fetchTasas();
  }, []);

  // Auto-refresh every 60 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTasas();
    }, 60 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: fetchTasas };
}

/**
 * Hook para obtener y gestionar tasas de cambio
 * Proporciona funciones de cálculo además de los datos crudos
 */
export function useExchangeRate(options?: UseExchangeRateOptions): UseExchangeRateReturn {
  const fallbackRate = options?.fallbackRate ?? 420;

  const { data: tasasData, loading, error, refetch } = useTasasElToque();

  const [exchangeRates, setExchangeRates] = useState<TasasData | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number>(fallbackRate);

  // Actualizar tasa cuando los datos estén disponibles
  useEffect(() => {
    //console.log('[useExchangeRate] Datos recibidos:', tasasData);
    
    if (tasasData?.tasas) {
      const tasas = tasasData.tasas;
      const usdRate = tasas.USD || tasas.MLC || fallbackRate;
      
      console.log('[useExchangeRate] USD Rate:', usdRate);
      console.log('[useExchangeRate] ECU Rate:', tasas.ECU);
      
      setExchangeRate(usdRate);
      setExchangeRates(tasasData);
    }
  }, [tasasData, fallbackRate]);

  // Calcular total en CUP
  const calculateCUP = useCallback((amountUSD: number): number => {
    return amountUSD * exchangeRate;
  }, [exchangeRate]);

  // Calcular total con costos adicionales
  const calculateCUPWithCosts = useCallback((
    amountUSD: number, 
    weightCost: number, 
    feePercentage: number = 0
  ): number => {
    const baseCost = amountUSD + weightCost;
    const fee = baseCost * (feePercentage / 100);
    return (baseCost + fee) * exchangeRate;
  }, [exchangeRate]);

  // Calcular total para landing page
  const calculateTotalCost = useCallback((
    priceUSD: number, 
    packageWeight: number, 
    paymentMethod: string
  ): number => {
    // Costo base
    const baseCost = priceUSD <= 15 ? priceUSD * 2.0 : priceUSD * 1.5;
    const packageWeightCost = packageWeight * 10;
    
    let fee = 0;
    let total = 0;
    
    if (paymentMethod.includes("cup")) {
      let cost = (baseCost + packageWeightCost) * exchangeRate;
      if (paymentMethod === "transfer-cup") {
        fee = cost * 0.2;
      }
      total = cost + fee;
    } else {
      if (paymentMethod === "cash-usd") {
        total = baseCost + packageWeightCost;
      } else if (paymentMethod === "cash-euro") {
        const ecuRate = exchangeRates?.tasas?.ECU || 0.9; // Fallback to approx EUR rate
        let dif = (baseCost + packageWeightCost) * exchangeRate;
        total = dif / ecuRate;
      }
    }
    
    return total;
  }, [exchangeRate, exchangeRates]);

  return {
    exchangeRate,
    exchangeRates,
    loading,
    error,
    refetch,
    calculateCUP,
    calculateCUPWithCosts,
    calculateTotalCost
  };
}

export default useExchangeRate;
