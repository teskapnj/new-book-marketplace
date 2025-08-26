// hooks/useShippo.ts
import { useState } from 'react';
import { ShippingAddress, ShippingParcel, ShippingRate } from '@/lib/shippo';

interface UseShippoReturn {
  shippingRates: ShippingRate[];
  selectedRate: ShippingRate | null;
  isCalculating: boolean;
  calculateRates: (addressFrom: ShippingAddress, addressTo: ShippingAddress, parcel: ShippingParcel) => Promise<void>;
  selectRate: (rate: ShippingRate) => void;
  error: string | null;
  resetError: () => void;
}

export const useShippo = (): UseShippoReturn => {
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculateRates = async (
    addressFrom: ShippingAddress, 
    addressTo: ShippingAddress, 
    parcel: ShippingParcel
  ) => {
    setIsCalculating(true);
    setError(null);
    setShippingRates([]);
    setSelectedRate(null);
    
    try {
      console.log('Calculating shipping rates with:', {
        addressFrom,
        addressTo,
        parcel
      });

      // API endpoint'iniz bu parameter isimlerini bekliyor
      const response = await fetch('/api/shipping/rates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address_from: addressFrom,  // API'nizde bu isim kullanılıyor
          address_to: addressTo,      // API'nizde bu isim kullanılıyor
          parcels: [parcel]           // API bir array bekliyor
        }),
      });

      console.log('Response status:', response.status);
      const responseText = await response.text();
      console.log('Response body:', responseText);

      if (!response.ok) {
        let errorMessage = 'Failed to calculate shipping rates';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          errorMessage = `HTTP ${response.status}: ${responseText}`;
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        throw new Error('Invalid JSON response from server');
      }

      console.log('Parsed response data:', data);

      // API response formatınıza göre güncellendi
      if (data.success && data.data && data.data.rates) {
        setShippingRates(data.data.rates);
        
        // Eğer rates varsa, en ucuzunu varsayılan olarak seç
        if (data.data.rates.length > 0) {
          const cheapestRate = data.data.rates.reduce((prev: ShippingRate, current: ShippingRate) => 
            parseFloat(prev.amount) < parseFloat(current.amount) ? prev : current
          );
          setSelectedRate(cheapestRate);
        }
      } else {
        throw new Error(data.message || 'No shipping rates available');
      }
    } catch (err) {
      console.error('Error calculating shipping rates:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setShippingRates([]);
      setSelectedRate(null);
    } finally {
      setIsCalculating(false);
    }
  };

  const selectRate = (rate: ShippingRate) => {
    setSelectedRate(rate);
  };

  const resetError = () => {
    setError(null);
  };

  return {
    shippingRates,
    selectedRate,
    isCalculating,
    calculateRates,
    selectRate,
    error,
    resetError
  };
};