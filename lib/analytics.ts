// lib/analytics.ts
// Funnel takibi için basit event gönderme yardımcısı

type FunnelEvent =
  | 'barcode_section_viewed' // Barkod giriş alanı kullanıcı tarafından görüldü
  | 'barcode_scanned'        // Her gerçek barkod sorgusunda bir kez
  | 'item_accepted'          // Ürün sepete eklendi
  | 'item_rejected'       // Ürün kabul edilmedi (teşhis amaçlı, dönüşüm değil)
  | 'minimum_reached'     // 5 ürüne ulaşıldı
  | 'shipping_started'    // Shipping aşamasına ulaşıldı
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