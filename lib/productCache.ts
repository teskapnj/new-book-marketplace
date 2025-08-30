// lib/productCache.ts
import { db, FieldValue } from '@/lib/firebaseAdmin';
import admin from 'firebase-admin';

// Type definitions for cache
export interface CachedAmazonProduct {
  title: string;
  image: string;
  price: number;
  sales_rank: number;
  category: string;
  asin: string;
}

export interface CachedPricingResult {
  accepted: boolean;
  ourPrice?: number;
  reason?: string;
  category: 'books' | 'cds' | 'dvds' | 'games' | 'unknown';
  priceRange?: string;
  rankRange?: string;
}

export interface ProductCacheEntry {
  identifier: string; // ISBN, UPC or ASIN
  identifierType: 'isbn' | 'upc' | 'asin' | 'unknown';
  product: CachedAmazonProduct;
  pricing: CachedPricingResult;
  message: string;
  debug?: {
    searchMethod: string;
    apiCalls: number;
    hasRank: boolean;
    dataConsistency?: string;
  };
  createdAt: admin.firestore.Timestamp;
  updatedAt: admin.firestore.Timestamp;
  expiresAt: admin.firestore.Timestamp; // For 10 days expiration
}

export class ProductCacheService {
  private collectionName = 'amazon_product_cache';

  /**
   * Get product info from cache
   * @param identifier - ISBN, UPC or ASIN
   * @returns Cached product info or null
   */
  async getFromCache(identifier: string): Promise<ProductCacheEntry | null> {
    try {
      // Normalize identifier
      const normalizedId = this.normalizeIdentifier(identifier);
      
      console.log(`Searching in cache: ${normalizedId}`);
      
      const docRef = db.collection(this.collectionName).doc(normalizedId);
      const docSnap = await docRef.get();
      
      if (docSnap.exists) {
        const data = docSnap.data() as ProductCacheEntry;
        
        // Check expiration
        const now = new Date();
        const expiresAt = data.expiresAt.toDate();
        
        if (now > expiresAt) {
          console.log(`Cache expired: ${normalizedId} (Expired: ${expiresAt})`);
          // Remove expired cache
          await this.removeFromCache(normalizedId);
          return null;
        }
        
        console.log(`Found in cache: ${normalizedId} (Expires: ${expiresAt})`);
        return data;
      }
      
      console.log(`Not found in cache: ${normalizedId}`);
      return null;
      
    } catch (error) {
      console.error('Cache read error:', error);
      return null;
    }
  }

  /**
   * Save product info to cache
   * @param identifier - ISBN, UPC or ASIN
   * @param identifierType - Identifier type
   * @param product - Amazon product info
   * @param pricing - Pricing result
   * @param message - Message
   * @param debug - Debug info
   */
  async saveToCache(
    identifier: string,
    identifierType: 'isbn' | 'upc' | 'asin' | 'unknown',
    product: CachedAmazonProduct,
    pricing: CachedPricingResult,
    message: string,
    debug?: any
  ): Promise<void> {
    try {
      const normalizedId = this.normalizeIdentifier(identifier);
      const now = new Date();
      const expiresAt = new Date(now.getTime() + (10 * 24 * 60 * 60 * 1000)); // 10 days later
      
      const cacheEntry = {
        identifier: normalizedId,
        identifierType,
        product,
        pricing,
        message,
        debug,
        createdAt: admin.firestore.Timestamp.fromDate(now),
        updatedAt: admin.firestore.Timestamp.fromDate(now),
        expiresAt: admin.firestore.Timestamp.fromDate(expiresAt)
      };
      
      const docRef = db.collection(this.collectionName).doc(normalizedId);
      await docRef.set(cacheEntry);
      
      console.log(`Saved to cache: ${normalizedId} (Expires: ${expiresAt})`);
      
    } catch (error) {
      console.error('Cache save error:', error);
      // Cache errors don't stop API, just log them
    }
  }

  /**
   * Remove a single product from cache
   * @param identifier - ISBN, UPC or ASIN
   */
  async removeFromCache(identifier: string): Promise<void> {
    try {
      const normalizedId = this.normalizeIdentifier(identifier);
      const docRef = db.collection(this.collectionName).doc(normalizedId);
      await docRef.delete();
      console.log(`Removed from cache: ${normalizedId}`);
    } catch (error) {
      console.error('Cache removal error:', error);
    }
  }

  /**
   * Clean all expired cache records
   * @returns Number of deleted records
   */
  async cleanExpiredCache(): Promise<number> {
    try {
      const now = new Date();
      const query = db.collection(this.collectionName)
        .where('expiresAt', '<', admin.firestore.Timestamp.fromDate(now));
      
      const querySnapshot = await query.get();
      let deletedCount = 0;
      
      // Batch delete for better performance
      const batch = db.batch();
      
      querySnapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
        deletedCount++;
      });
      
      if (deletedCount > 0) {
        await batch.commit();
      }
      
      console.log(`Cleaned cache records: ${deletedCount}`);
      return deletedCount;
      
    } catch (error) {
      console.error('Cache cleanup error:', error);
      return 0;
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<{
    total: number;
    expired: number;
    valid: number;
  }> {
    try {
      const allDocsQuery = db.collection(this.collectionName);
      const allSnapshot = await allDocsQuery.get();
      
      const now = new Date();
      let expired = 0;
      let valid = 0;
      
      allSnapshot.docs.forEach(doc => {
        const data = doc.data() as ProductCacheEntry;
        const expiresAt = data.expiresAt.toDate();
        
        if (now > expiresAt) {
          expired++;
        } else {
          valid++;
        }
      });
      
      return {
        total: allSnapshot.size,
        expired,
        valid
      };
      
    } catch (error) {
      console.error('Cache stats error:', error);
      return { total: 0, expired: 0, valid: 0 };
    }
  }

  /**
   * Normalize identifiers (uppercase, remove spaces)
   * @param identifier - Raw identifier
   * @returns Normalized identifier
   */
  private normalizeIdentifier(identifier: string): string {
    return identifier.replace(/[^a-zA-Z0-9X]/gi, '').trim().toUpperCase();
  }

  /**
   * Check if cache collection is accessible
   */
  async checkCacheHealth(): Promise<boolean> {
    try {
      const testDoc = db.collection(this.collectionName).doc('__health_check__');
      await testDoc.get();
      return true;
    } catch (error) {
      console.error('Cache health check error:', error);
      return false;
    }
  }
}

// Singleton instance
export const productCache = new ProductCacheService();