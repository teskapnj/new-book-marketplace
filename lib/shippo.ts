// lib/shippo.ts - Using REST API instead of SDK
// Environment variables check
if (!process.env.SHIPPO_API_KEY) {
  throw new Error('SHIPPO_API_KEY is required in environment variables');
}

// Check if we're in test mode
const isTestMode = process.env.SHIPPO_API_KEY.startsWith('shippo_test_') || process.env.NODE_ENV === 'test';

// Type definitions
export interface ShippingAddress {
  name?: string;
  company?: string;
  street1: string;
  street?: string; // Backward compatibility
  street2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone?: string;
  email?: string;
}

export interface ShippingParcel {
  length: number;
  width: number;
  height: number;
  distance_unit: 'in' | 'cm';
  weight: number;
  mass_unit: 'lb' | 'kg' | 'oz' | 'g';
}

export interface ShippingRate {
  object_id: string;
  amount: string;
  currency: string;
  provider: string;
  provider_image_75: string;
  provider_image_200: string;
  servicelevel: {
    name: string;
    token: string;
  };
  estimated_days: number;
  duration_terms: string;
  messages: any[];
  attributes: string[];
}

// Shippo API base URL
const SHIPPO_API_BASE = 'https://api.goshippo.com';

// Helper function to make Shippo API requests
async function shippoRequest(endpoint: string, method: 'GET' | 'POST' = 'GET', body?: any) {
  const url = `${SHIPPO_API_BASE}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Authorization': `ShippoToken ${process.env.SHIPPO_API_KEY}`,
    'Content-Type': 'application/json',
  };

  const options: RequestInit = {
    method,
    headers,
  };

  if (body && method === 'POST') {
    options.body = JSON.stringify(body);
  }

  console.log(`Making ${method} request to: ${url}`);
  if (body) console.log('Request body:', JSON.stringify(body, null, 2));

  const response = await fetch(url, options);
  
  console.log('Response status:', response.status);
  
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Shippo API error:', errorText);
    throw new Error(`Shippo API error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  console.log('Response data:', JSON.stringify(data, null, 2));
  
  return data;
}

// Updated getShippingRates function using REST API
export async function getShippingRates(
  addressFrom: ShippingAddress,
  addressTo: ShippingAddress,
  parcel: ShippingParcel
): Promise<{ rates: ShippingRate[]; messages: any[] }> {
  try {
    console.log('Creating shipment with addresses:', {
      from: addressFrom,
      to: addressTo,
      parcel: parcel
    });

    // Validate addresses and parcel
    const fromErrors = validateAddress(addressFrom);
    const toErrors = validateAddress(addressTo);
    const parcelErrors = validateParcel(parcel);
    
    if (fromErrors.length > 0 || toErrors.length > 0 || parcelErrors.length > 0) {
      throw new Error('Validation failed: ' + 
        [...fromErrors, ...toErrors, ...parcelErrors].join(', '));
    }
    
    // Normalize address formats for Shippo API
    const normalizedAddressFrom = {
      name: addressFrom.name || 'Store',
      street1: addressFrom.street1 || (addressFrom as any).street || '',
      city: addressFrom.city || '',
      state: addressFrom.state || '',
      zip: addressFrom.zip || '',
      country: addressFrom.country || 'US'
    };
    
    const normalizedAddressTo = {
      name: addressTo.name || 'Customer',
      street1: addressTo.street1 || (addressTo as any).street || '',
      city: addressTo.city || '',
      state: addressTo.state || '',
      zip: addressTo.zip || '',
      country: addressTo.country || 'US'
    };
    
    console.log('Normalized addresses:', {
      from: normalizedAddressFrom,
      to: normalizedAddressTo
    });
    
    // Create shipment using Shippo REST API
    const shipmentData = {
      address_from: normalizedAddressFrom,
      address_to: normalizedAddressTo,
      parcels: [parcel],
      async: false
    };

    const shipment = await shippoRequest('/shipments/', 'POST', shipmentData);
    
    console.log('Shipment created:', shipment);
    
    // Check if shipment was created successfully
    if (shipment && shipment.rates && Array.isArray(shipment.rates)) {
      // Filter out rates with errors
      const validRates = shipment.rates.filter((rate: any) => 
        !rate.messages || rate.messages.length === 0
      );
      
      return {
        rates: validRates,
        messages: shipment.messages || []
      };
    } else {
      // Extract error message from response
      const errorMessage = shipment.messages?.[0]?.text || 'No rates available';
      throw new Error(`Failed to get shipping rates: ${errorMessage}`);
    }
  } catch (error) {
    console.error('Error getting shipping rates:', error);
    
    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes('Invalid address')) {
        throw new Error('Invalid shipping address provided');
      } else if (error.message.includes('API key') || error.message.includes('401')) {
        throw new Error('Shippo API key is invalid or missing');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        throw new Error('Network error connecting to Shippo API');
      }
    }
    
    throw error;
  }
}

// Validation functions
export function validateAddress(address: ShippingAddress): string[] {
  const errors: string[] = [];
  
  // Check both street1 and street fields for backward compatibility
  if (!address.street1?.trim() && !address.street?.trim()) {
    errors.push('Street address is required');
  }
  
  if (!address.city?.trim()) {
    errors.push('City is required');
  }
  
  if (!address.state?.trim()) {
    errors.push('State is required');
  }
  
  if (!address.zip?.trim()) {
    errors.push('ZIP code is required');
  }
  
  if (!address.country?.trim()) {
    errors.push('Country is required');
  }
  
  // ZIP code format validation for US
  if (address.country === 'US' && address.zip) {
    const zipRegex = /^\d{5}(-\d{4})?$/;
    if (!zipRegex.test(address.zip)) {
      errors.push('Invalid US ZIP code format (should be 12345 or 12345-6789)');
    }
  }
  
  return errors;
}

export function validateParcel(parcel: ShippingParcel): string[] {
  const errors: string[] = [];
  
  const numericFields = [
    { field: 'length', value: parcel.length },
    { field: 'width', value: parcel.width },
    { field: 'height', value: parcel.height },
    { field: 'weight', value: parcel.weight }
  ];
  
  numericFields.forEach(({ field, value }) => {
    if (value === undefined || value === null) {
      errors.push(`${field} is required`);
    } else if (isNaN(value) || value <= 0) {
      errors.push(`${field} must be a positive number`);
    }
  });
  
  if (!parcel.distance_unit || !['in', 'cm'].includes(parcel.distance_unit)) {
    errors.push('distance_unit must be "in" or "cm"');
  }
  
  if (!parcel.mass_unit || !['lb', 'kg', 'oz', 'g'].includes(parcel.mass_unit)) {
    errors.push('mass_unit must be "lb", "kg", "oz" or "g"');
  }
  
  return errors;
}

// Test connection function
export async function testShippoConnection(): Promise<boolean> {
  try {
    console.log('Testing Shippo connection...');
    
    // Test by creating a simple address validation
    const testAddress = {
      name: 'Test Address',
      street1: '123 Test St',
      city: 'San Francisco',
      state: 'CA',
      zip: '94107',
      country: 'US'
    };

    const result = await shippoRequest('/addresses/', 'POST', testAddress);
    
    console.log('Shippo connection test successful:', result);
    return true;
  } catch (error) {
    console.error('Shippo connection test failed:', error);
    return false;
  }
}

// Helper function to convert string parcel to number parcel
export function convertParcelToNumbers(parcel: any): ShippingParcel {
  return {
    length: typeof parcel.length === 'string' ? parseFloat(parcel.length) : parcel.length,
    width: typeof parcel.width === 'string' ? parseFloat(parcel.width) : parcel.width,
    height: typeof parcel.height === 'string' ? parseFloat(parcel.height) : parcel.height,
    distance_unit: parcel.distance_unit,
    weight: typeof parcel.weight === 'string' ? parseFloat(parcel.weight) : parcel.weight,
    mass_unit: parcel.mass_unit
  };
}

// Default addresses for testing
export const testAddresses = {
  warehouse: {
    name: 'Envy Warehouse',
    company: 'Envy Marketplace',
    street1: '123 Warehouse St',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    country: 'US',
    phone: '+1-555-0123',
    email: 'warehouse@envy.com'
  },
  customer: {
    name: 'Test Customer',
    street1: '456 Customer Ave',
    city: 'Los Angeles',
    state: 'CA',
    zip: '90210',
    country: 'US',
    phone: '+1-555-0456',
    email: 'customer@example.com'
  }
};

export const testParcel: ShippingParcel = {
  length: 10,
  width: 8,
  height: 6,
  distance_unit: 'in',
  weight: 2,
  mass_unit: 'lb'
};

// Function to check if we're in test mode
export function isTestModeEnabled(): boolean {
  return isTestMode;
}