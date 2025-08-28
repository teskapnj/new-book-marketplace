// 1. components/TrackingForm.tsx
import { useState } from 'react';

interface TrackingFormProps {
  orderId: string;
  currentStatus: string;
  onTrackingAdded: () => void;
}

export default function TrackingForm({ orderId, currentStatus, onTrackingAdded }: TrackingFormProps) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('usps');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!trackingNumber.trim()) {
      alert('Please enter a tracking number');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/orders/${orderId}/add-tracking`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackingNumber: trackingNumber.trim().toUpperCase(),
          carrier
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add tracking');
      }

      setTrackingNumber('');
      setCarrier('usps');
      onTrackingAdded();
      
      alert('Tracking number added successfully!');

    } catch (error) {
      console.error('Error adding tracking:', error);
      alert('Failed to add tracking number. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (currentStatus !== 'confirmed' && currentStatus !== 'processing') {
    return null;
  }

  return (
    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
      <h4 className="text-sm font-medium text-gray-900 mb-3">Add Tracking Information</h4>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tracking Number
          </label>
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter tracking number"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Carrier
          </label>
          <select 
            value={carrier}
            onChange={(e) => setCarrier(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
          >
            <option value="usps">USPS</option>
            <option value="fedex">FedEx</option>
            <option value="ups">UPS</option>
            <option value="dhl">DHL</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !trackingNumber.trim()}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Adding Tracking...' : 'Add Tracking'}
        </button>
      </form>
    </div>
  );
}