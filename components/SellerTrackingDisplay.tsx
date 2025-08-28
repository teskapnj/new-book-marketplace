// components/SellerTrackingDisplay.tsx
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

interface TrackingDisplayProps {
  orderId: string;
}

interface TrackingHistory {
  status: string;
  message: string;
  timestamp: any;
  location?: string;
}

export default function SellerTrackingDisplay({ orderId }: TrackingDisplayProps) {
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderRef = doc(db, 'orders', orderId);
    
    const unsubscribe = onSnapshot(orderRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setTrackingData({
          trackingNumber: data.trackingNumber,
          carrier: data.carrier,
          trackingUrl: data.trackingUrl,
          status: data.status,
          trackingStatus: data.trackingStatus,
          trackingHistory: data.trackingHistory || [],
          shippedAt: data.shippedAt,
          deliveredAt: data.deliveredAt
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [orderId]);

  if (loading) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!trackingData?.trackingNumber) {
    return (
      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <p className="text-yellow-800 text-sm">
          📦 Tracking information will appear here once the order is shipped by admin.
        </p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    const icons = {
      'shipped': '📦',
      'TRANSIT': '🚚',
      'OUT_FOR_DELIVERY': '🚛',
      'DELIVERED': '✅',
      'EXCEPTION': '⚠️'
    };
    return icons[status as keyof typeof icons] || '📦';
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-medium text-gray-900">Shipping Information</h4>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
          trackingData.status === 'delivered' 
            ? 'bg-green-100 text-green-800'
            : trackingData.status === 'shipped'
            ? 'bg-blue-100 text-blue-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {getStatusIcon(trackingData.trackingStatus || trackingData.status)} 
          {trackingData.trackingStatus || trackingData.status}
        </span>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Tracking Number</label>
            <p className="text-sm font-mono bg-gray-50 p-2 rounded border">
              {trackingData.trackingNumber}
            </p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Carrier</label>
            <p className="text-sm capitalize p-2">
              {trackingData.carrier?.toUpperCase()}
            </p>
          </div>
        </div>

        {trackingData.trackingUrl && (
          <div>
            <a
              href={trackingData.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
            >
              📍 Track Package on {trackingData.carrier?.toUpperCase()} Website
            </a>
          </div>
        )}

        {trackingData.shippedAt && (
          <div>
            <label className="text-sm font-medium text-gray-500">Shipped At</label>
            <p className="text-sm text-gray-700">
              {formatDate(trackingData.shippedAt)}
            </p>
          </div>
        )}

        {trackingData.deliveredAt && (
          <div>
            <label className="text-sm font-medium text-gray-500">Delivered At</label>
            <p className="text-sm text-green-700 font-medium">
              {formatDate(trackingData.deliveredAt)}
            </p>
          </div>
        )}

        {trackingData.trackingHistory && trackingData.trackingHistory.length > 0 && (
          <div>
            <label className="text-sm font-medium text-gray-500 mb-2 block">Tracking History</label>
            <div className="max-h-40 overflow-y-auto space-y-2">
              {trackingData.trackingHistory.map((event: TrackingHistory, index: number) => (
                <div key={index} className="border-l-2 border-gray-200 pl-3 pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {event.message}
                      </p>
                      {event.location && (
                        <p className="text-xs text-gray-500">{event.location}</p>
                      )}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      {formatDate(event.timestamp)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Usage in seller dashboard:
// <SellerTrackingDisplay orderId={order.id} />