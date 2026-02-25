'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTasasElToque } from './use-elToque';

export interface ExchangeRateData {
  USD?: number;
  ECU?: number;
  tasas?: {
    USD?: number;
    ECU?: number;
    [key: string]: number | undefined;
  };
  [key: string]: any;
}

export interface UseExchangeRateOptions {
  /** Tasa de cambio inicial si la API falla (por defecto: 420) */
  fallbackRate?: number;
  /** Intervalo de auto-actualización en milisegundos (por defecto: 3600000 = 1 hora) */
  refreshInterval?: number;
}

export interface UseExchangeRateReturn {
  /** Tasa actual de USD a CUP */
  exchangeRate: number;
  /** Datos completos de tasas de la API */
  exchangeRates: ExchangeRateData | null;
  /** Estado de carga */
  loading: boolean;
  /** Mensaje de error si la API falla */
  error: string | null;
  /** Función para actualizar manualmente */
  refetch: () => void;
  /** Calcular total en CUP */
  calculateCUP: (amountUSD: number) => number;
  /** Calcular total con costos adicionales en CUP */
  calculateCUPWithCosts: (amountUSD: number, weightCost: number, feePercentage?: number) => number;
  /** 
   * Calcular total para la calculadora del landing page
   * - Para precios ≤ $15: costo base es precio * 2.0
   * - Para precios > $15: costo base es precio * 1.5
   * - Agrega costo por peso del paquete
   * - Aplica 20% de comisión para transfer-cup
   */
  calculateTotalCost: (priceUSD: number, packageWeight: number, paymentMethod: string) => number;
}

/**
 * Hook para obtener y gestionar tasas de cambio de la API de El Toque
 * Usado por la calculadora del landing page y el modal de creación de pedidos
 */
export function useExchangeRate(options?: UseExchangeRateOptions): UseExchangeRateReturn {
  const fallbackRate = options?.fallbackRate ?? 420;
  const refreshInterval = options?.refreshInterval ?? 3600000; // 1 hora

  // Obtener tasas de cambio de la API de El Toque
  const { data: tasasData, loading, error, refetch } = useTasasElToque();

  const [exchangeRates, setExchangeRates] = useState<ExchangeRateData | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number>(fallbackRate);

  // Actualizar tasa de cambio cuando los datos de la API estén disponibles
  useEffect(() => {
    
    if (tasasData?.tasas) {
      const tasas = tasasData.tasas;
      
      const usdRate = tasas.USD || tasas.MLC || 420;
      
      setExchangeRate(usdRate);
      console.log('[useExchangeRate] exchangeRate actualizado a:', usdRate);
      
      // Guardar todas las tasas de cambio disponibles
      const rates: ExchangeRateData = {
        USD: tasas.USD || usdRate,
        ECU: tasas.ECU,
        BNB: tasas.BNB,
        MLC: tasas.MLC,
        BTC: tasas.BTC,
        USDT_TRC20: tasas.USDT_TRC20,
        TRX: tasas.TRX,
        ...tasas
      };

      setExchangeRates(rates);
    } else if (tasasData?.USD) {
      setExchangeRate(tasasData.USD);
      setExchangeRates(tasasData as unknown as ExchangeRateData);
    } else {
      console.log('[useExchangeRate] No hay datos de tasas disponibles, usando valores por defecto');
    }
  }, [tasasData]);

  // Calcular total en CUP
  const calculateCUP = useCallback((amountUSD: number): number => {
    const result = amountUSD * exchangeRate;
    return result;
  }, [exchangeRate]);

  // Calcular total con costos adicionales en CUP
  const calculateCUPWithCosts = useCallback((
    amountUSD: number, 
    weightCost: number, 
    feePercentage: number = 0
  ): number => {
    const baseCost = amountUSD + weightCost;
    const fee = baseCost * (feePercentage / 100);
    const result = (baseCost + fee) * exchangeRate;
    return result;
  }, [exchangeRate]);

  // Calcular total para landing page (con lógica de negocio)
  const calculateTotalCost = useCallback((
    priceUSD: number, 
    packageWeight: number, 
    paymentMethod: string
  ): number => {
    // Paso 1: Cálculo del costo base
    const baseCost = priceUSD <= 15 ? priceUSD * 2.0 : priceUSD * 1.5;
    
    // Paso 2: Costo por peso del paquete
    const packageWeightCost = packageWeight * 10;
    
    let fee = 0;
    let total = 0;
    
    if (paymentMethod.includes("cup")) {
      let cost = (baseCost + packageWeightCost) * exchangeRate;
      
      if (paymentMethod === "transfer-cup") {
        fee = cost * 0.2;
      } else if (paymentMethod === "cash-cup") {
        fee = 0;
      }
      total = cost + fee;
    } else {
      if (paymentMethod === "cash-usd") {
        total = baseCost + packageWeightCost;
      } else if (paymentMethod === "cash-euro") {
        const ecuRate = exchangeRates?.ECU ?? exchangeRates?.tasas?.ECU ?? 1;
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
