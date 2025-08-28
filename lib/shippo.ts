// lib/shippo.ts

// Shippo API anahtarını environment variable'dan al
const SHIPPO_API_KEY = process.env.SHIPPO_API_KEY || '';
const SHIPPO_API_VERSION = process.env.SHIPPO_API_VERSION || '2018-02-08';

// Shippo API'ye genel istek fonksiyonu
async function shippoRequest(endpoint: string, method: string = 'GET', data: any = null) {
  try {
    const url = `https://api.goshippo.com${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        'Authorization': `ShippoToken ${SHIPPO_API_KEY}`,
        'Content-Type': 'application/json',
        'Shippo-API-Version': SHIPPO_API_VERSION
      }
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    console.log(`Making ${method} request to: ${url}`);
    if (data) {
      console.log('Request body:', JSON.stringify(data, null, 2));
    }

    const response = await fetch(url, options);
    console.log(`Response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shippo API error:', errorText);
      throw new Error(`Shippo API error ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Shippo request failed:', error);
    throw error;
  }
}

// Takip bilgisi başlatma
export async function initializeShippoTracking(trackingNumber: string, carrier: string) {
  try {
    console.log(`Initializing Shippo tracking for ${trackingNumber} with carrier ${carrier}`);
    
    // Test takip numaraları için carrier'ı "shippo" olarak değiştir
    let shippoCarrier = carrier;
    if (trackingNumber === "SHippoTest" || trackingNumber === "10000000000000000") {
      shippoCarrier = "shippo";
      console.log(`Using test carrier: ${shippoCarrier} for tracking number: ${trackingNumber}`);
    }
    
    const data = {
      tracking_number: trackingNumber,
      carrier: shippoCarrier
    };
    
    console.log('Sending tracking data to Shippo:', data);
    
    const response = await shippoRequest('/tracks/', 'POST', data);
    console.log('Shippo tracking initialized successfully:', response);
    
    return response;
  } catch (error) {
    console.error('Failed to initialize Shippo tracking:', error);
    throw error;
  }
}

// Takip bilgisi alma
export async function getTrackingStatus(trackingNumber: string, carrier: string) {
  try {
    console.log(`Getting tracking status for ${trackingNumber} with carrier ${carrier}`);
    
    // Test takip numaraları için carrier'ı "shippo" olarak değiştir
    let shippoCarrier = carrier;
    if (trackingNumber === "SHippoTest" || trackingNumber === "10000000000000000") {
      shippoCarrier = "shippo";
      console.log(`Using test carrier: ${shippoCarrier} for tracking number: ${trackingNumber}`);
    }
    
    const response = await shippoRequest(`/tracks/${shippoCarrier}/${trackingNumber}`);
    console.log('Tracking status retrieved successfully:', response);
    
    return response;
  } catch (error) {
    console.error('Failed to get tracking status:', error);
    throw error;
  }
}

// Kargo şirketine göre tracking URL oluşturma
export function getTrackingUrl(carrier: string, trackingNumber: string): string {
  switch (carrier.toLowerCase()) {
    case "usps":
      return `https://tools.usps.com/go/TrackConfirmAction_input?qtc_tLabels1=${trackingNumber}`;
    case "fedex":
      return `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`;
    case "ups":
      return `https://www.ups.com/track?tracknum=${trackingNumber}`;
    case "dhl":
      return `https://www.dhl.com/us-en/home/tracking/tracking-parcel.html?submit=1&tracking-id=${trackingNumber}`;
    default:
      return "";
  }
}

// Webhook doğrulama
export function verifyWebhook(request: Request) {
  // Shippo webhook doğrulama mantığı
  // Bu fonksiyonu webhook handler'da kullanabilirsiniz
  const signature = request.headers.get('x-shippo-signature');
  const payload = request.headers.get('x-shippo-payload');
  
  if (!signature || !payload) {
    return false;
  }
  
  // Gerçek uygulamada burada HMAC doğrulaması yapmalısınız
  // Şimdilik sadece true döndürüyoruz
  return true;
}

// Kargo şirketleri listesi
export const CARRIERS = [
  { value: 'usps', label: 'USPS' },
  { value: 'fedex', label: 'FedEx' },
  { value: 'ups', label: 'UPS' },
  { value: 'dhl', label: 'DHL' },
  { value: 'shippo', label: 'Shippo Test' }
];

// Test takip numaraları
export const TEST_TRACKING_NUMBERS = {
  usps: "SHippoTest",
  fedex: "SHippoTest",
  ups: "SHippoTest",
  dhl: "SHippoTest",
  generic: "10000000000000000"
};