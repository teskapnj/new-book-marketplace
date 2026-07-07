// components/RateLimitWarning.tsx
import React from 'react';

interface RateLimitWarningProps {
  isBlocked: boolean;
  remainingTime: number;
  attempts: number;
  maxAttempts: number;
}

export const RateLimitWarning: React.FC<RateLimitWarningProps> = ({ 
  isBlocked, 
  remainingTime, 
  attempts, 
  maxAttempts 
}) => {
  if (isBlocked) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md mx-4 shadow-xl">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">🚫</div>
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Too Many Attempts
            </h2>
            <p className="text-gray-600 mb-6">
              Your access has been temporarily restricted for security reasons.
            </p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 font-semibold">
                Time remaining: {Math.floor(remainingTime / 60)}:{String(remainingTime % 60).padStart(2, '0')}
              </p>
            </div>
            <p className="text-sm text-gray-500">
              You can try again after this time.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Uyarı mesajı (limite yaklaşıldığında)
  if (attempts > 0 && attempts >= maxAttempts - 2) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
        <div className="flex items-center">
          <div className="text-yellow-500 text-xl mr-3">⚠️</div>
          <div>
            <p className="text-yellow-700 font-medium">
              Warning: {maxAttempts - attempts} attempts remaining
            </p>
            <p className="text-yellow-600 text-sm">
              Your access will be temporarily restricted if you exceed the limit.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};