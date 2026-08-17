// lib/analytics.ts
// Funnel takibi için basit event gönderme yardımcısı

type FunnelEvent =
  | 'scan_started'        // Tarama başladı (kamera veya manuel giriş)
  | 'item_accepted'       // Ürün sepete eklendi
  | 'item_rejected'       // Ürün kabul edilmedi (teşhis amaçlı, dönüşüm değil)
  | 'minimum_reached'     // 5 ürüne ulaşıldı
  | 'shipping_started'    // Shipping sayfasına geçildi
  | 'listing_submitted';  // Gönderim tamamlandı

export const trackEvent = (
  event: FunnelEvent,
  params?: Record<string, string | number>
) => {
  try {
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', event, params || {});
      console.log(`📊 Event: ${event}`, params || '');
    }
  } catch (error) {
    // Analytics hatası uygulamayı asla bozmamalı
    console.warn('Analytics event failed:', error);
  }
};