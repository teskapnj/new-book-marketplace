// components/ShippingCalculator.tsx
import { useState } from 'react';

export default function ShippingCalculator() {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateRates = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/usps/rates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          originZip: '90210',    // Gönderi postcode
          destinationZip: '10001', // Alıcı postcode
          weight: 1.5,           // Ağırlık (lb)
          dimensions: {          // Boyutlar (inç)
            length: 10,
            width: 5,
            height: 8
          }
        })
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Bilinmeyen hata');
      }
      
      setRates(data.rates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={calculateRates} disabled={loading}>
        {loading ? 'Hesaplanıyor...' : 'Kargo Ücretlerini Hesapla'}
      </button>
      
      {error && <div className="error">Hata: {error}</div>}
      
      {rates.length > 0 && (
        <div>
          <h3>Kargo Seçenekleri:</h3>
          <ul>
            {rates.map((rate: any) => (
              <li key={rate.object_id}>
                {rate.servicelevel.name}: ${rate.amount} 
                ({rate.estimated_days} gün)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}