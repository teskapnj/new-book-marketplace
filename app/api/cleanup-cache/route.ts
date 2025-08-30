// /app/api/cleanup-cache/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { productCache } from '@/lib/productCache';

interface CleanupResponse {
  success: boolean;
  data?: {
    beforeStats: {
      total: number;
      expired: number;
      valid: number;
    };
    afterStats: {
      total: number;
      expired: number;
      valid: number;
    };
    deletedCount: number;
    message: string;
  };
  error?: string;
}

interface StatsResponse {
  success: boolean;
  data?: {
    stats: {
      total: number;
      expired: number;
      valid: number;
    };
    cacheHealth: boolean;
    message: string;
  };
  error?: string;
}

/**
 * POST /api/cleanup-cache
 * Süresi dolmuş cache kayıtlarını temizler
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Auth kontrolü (opsiyonel - admin kullanıcı kontrolü eklenebilir)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CACHE_CLEANUP_TOKEN;
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({
        success: false,
        error: 'Yetkisiz erişim - geçersiz token'
      } as CleanupResponse, { status: 401 });
    }

    console.log('🧹 Cache temizleme işlemi başlatılıyor...');
    
    // Temizlemeden önceki istatistikleri al
    const beforeStats = await productCache.getCacheStats();
    console.log(`📊 Temizlemeden önce: ${beforeStats.total} toplam, ${beforeStats.expired} süresi dolmuş, ${beforeStats.valid} geçerli`);
    
    // Süresi dolmuş cache'leri temizle
    const deletedCount = await productCache.cleanExpiredCache();
    
    // Temizlemeden sonraki istatistikleri al
    const afterStats = await productCache.getCacheStats();
    console.log(`📊 Temizlemeden sonra: ${afterStats.total} toplam, ${afterStats.expired} süresi dolmuş, ${afterStats.valid} geçerli`);
    
    const message = deletedCount > 0 
      ? `${deletedCount} süresi dolmuş cache kaydı başarıyla silindi`
      : 'Silinecek süresi dolmuş cache kaydı bulunamadı';
    
    console.log(`✅ ${message}`);
    
    return NextResponse.json({
      success: true,
      data: {
        beforeStats,
        afterStats,
        deletedCount,
        message
      }
    } as CleanupResponse);

  } catch (error: any) {
    console.error('❌ Cache temizleme hatası:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Cache temizleme işlemi sırasında bir hata oluştu'
    } as CleanupResponse, { status: 500 });
  }
}

/**
 * GET /api/cleanup-cache
 * Cache istatistiklerini ve durumunu gösterir
 */
export async function GET(): Promise<NextResponse> {
  try {
    console.log('📊 Cache istatistikleri getiriliyor...');
    
    // Cache sağlık kontrolü
    const cacheHealth = await productCache.checkCacheHealth();
    
    // Cache istatistikleri
    const stats = await productCache.getCacheStats();
    
    const message = `Cache durumu: ${stats.total} toplam kayıt (${stats.valid} aktif, ${stats.expired} süresi dolmuş)`;
    
    console.log(`📊 ${message}`);
    
    return NextResponse.json({
      success: true,
      data: {
        stats,
        cacheHealth,
        message
      }
    } as StatsResponse);

  } catch (error: any) {
    console.error('❌ Cache istatistikleri hatası:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Cache istatistikleri alınırken bir hata oluştu'
    } as StatsResponse, { status: 500 });
  }
}

/**
 * DELETE /api/cleanup-cache
 * Belirli bir identifier'a ait cache kaydını siler
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const identifier = url.searchParams.get('id');
    
    if (!identifier) {
      return NextResponse.json({
        success: false,
        error: 'Silinecek identifier (id) parametresi gerekli'
      }, { status: 400 });
    }

    console.log(`🗑️ Cache kaydı siliniyor: ${identifier}`);
    
    await productCache.removeFromCache(identifier);
    
    return NextResponse.json({
      success: true,
      data: {
        message: `Cache kaydı başarıyla silindi: ${identifier}`
      }
    });

  } catch (error: any) {
    console.error('❌ Cache silme hatası:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Cache kaydı silinirken bir hata oluştu'
    }, { status: 500 });
  }
}