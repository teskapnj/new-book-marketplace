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
 * Cleans up expired cache entries
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Auth check (optional - admin user check can be added)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.CACHE_CLEANUP_TOKEN;
    
    if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized access - invalid token'
      } as CleanupResponse, { status: 401 });
    }

    console.log('🧹 Starting cache cleanup operation...');
    
    // Get statistics before cleanup
    const beforeStats = await productCache.getCacheStats();
    console.log(`📊 Before cleanup: ${beforeStats.total} total, ${beforeStats.expired} expired, ${beforeStats.valid} valid`);
    
    // Clean expired caches
    const deletedCount = await productCache.cleanExpiredCache();
    
    // Get statistics after cleanup
    const afterStats = await productCache.getCacheStats();
    console.log(`📊 After cleanup: ${afterStats.total} total, ${afterStats.expired} expired, ${afterStats.valid} valid`);
    
    const message = deletedCount > 0 
      ? `${deletedCount} expired cache entries successfully deleted`
      : 'No expired cache entries found to delete';
    
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

  } catch (error: unknown) {
    console.error('❌ Cache cleanup error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'An error occurred during cache cleanup operation'
    } as CleanupResponse, { status: 500 });
  }
}

/**
 * GET /api/cleanup-cache
 * Shows cache statistics and status
 */
export async function GET(): Promise<NextResponse> {
  try {
    console.log('📊 Getting cache statistics...');
    
    // Cache health check
    const cacheHealth = await productCache.checkCacheHealth();
    
    // Cache statistics
    const stats = await productCache.getCacheStats();
    
    const message = `Cache status: ${stats.total} total entries (${stats.valid} active, ${stats.expired} expired)`;
    
    console.log(`📊 ${message}`);
    
    return NextResponse.json({
      success: true,
      data: {
        stats,
        cacheHealth,
        message
      }
    } as StatsResponse);

  } catch (error: unknown) {
    console.error('❌ Cache statistics error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'An error occurred while getting cache statistics'
    } as StatsResponse, { status: 500 });
  }
}

/**
 * DELETE /api/cleanup-cache
 * Deletes cache entry for a specific identifier
 */
export async function DELETE(request: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(request.url);
    const identifier = url.searchParams.get('id');
    
    if (!identifier) {
      return NextResponse.json({
        success: false,
        error: 'Identifier (id) parameter is required for deletion'
      }, { status: 400 });
    }

    console.log(`🗑️ Deleting cache entry: ${identifier}`);
    
    await productCache.removeFromCache(identifier);
    
    return NextResponse.json({
      success: true,
      data: {
        message: `Cache entry successfully deleted: ${identifier}`
      }
    });

  } catch (error: unknown) {
    console.error('❌ Cache deletion error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'An error occurred while deleting cache entry'
    }, { status: 500 });
  }
}