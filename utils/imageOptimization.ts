// utils/imageOptimization.ts

/**
 * Resim optimizasyon ayarları
 */
export const IMAGE_CONFIG = {
    maxWidth: 1200,        // Maximum genişlik (px)
    maxHeight: 1200,       // Maximum yükseklik (px)
    thumbnailWidth: 300,   // Thumbnail genişlik
    thumbnailHeight: 300,  // Thumbnail yükseklik
    quality: 0.8,         // JPEG kalitesi (0-1 arası)
    maxSizeMB: 1,        // Maximum dosya boyutu (MB)
  };
  
  /**
   * Canvas kullanarak resmi yeniden boyutlandırır ve sıkıştırır
   */
  export const compressImage = (
    file: File,
    maxWidth: number = IMAGE_CONFIG.maxWidth,
    maxHeight: number = IMAGE_CONFIG.maxHeight,
    quality: number = IMAGE_CONFIG.quality
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const img = new Image();
        
        img.onload = () => {
          // Canvas oluştur
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Canvas context not available'));
            return;
          }
          
          // Orijinal boyutlar
          let { width, height } = img;
          
          // Aspect ratio'yu koru
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }
          
          // Canvas boyutlarını ayarla
          canvas.width = width;
          canvas.height = height;
          
          // Resmi çiz
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);
          
          // Blob olarak dönüştür
          canvas.toBlob(
            (blob) => {
              if (blob) {
                console.log(`Image compressed: ${file.size} bytes -> ${blob.size} bytes (${Math.round((blob.size / file.size) * 100)}%)`);
                resolve(blob);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            'image/jpeg',
            quality
          );
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load image'));
        };
        
        img.src = e.target?.result as string;
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsDataURL(file);
    });
  };
  
  /**
   * Base64 string'i sıkıştırır
   */
  export const compressBase64Image = (
    base64String: string,
    maxWidth: number = IMAGE_CONFIG.maxWidth,
    maxHeight: number = IMAGE_CONFIG.maxHeight,
    quality: number = IMAGE_CONFIG.quality
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        
        let { width, height } = img;
        
        // Aspect ratio'yu koru
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);
        
        // Sıkıştırılmış base64 döndür
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        
        // Boyut karşılaştırması için log
        const originalSize = base64String.length;
        const compressedSize = compressedBase64.length;
        console.log(`Base64 compressed: ${originalSize} chars -> ${compressedSize} chars (${Math.round((compressedSize / originalSize) * 100)}%)`);
        
        resolve(compressedBase64);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = base64String;
    });
  };
  
  /**
   * Thumbnail oluşturur
   */
  export const createThumbnail = (
    file: File | string,
    width: number = IMAGE_CONFIG.thumbnailWidth,
    height: number = IMAGE_CONFIG.thumbnailHeight
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      const processImage = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }
        
        // Square thumbnail için center crop
        const size = Math.min(img.width, img.height);
        const x = (img.width - size) / 2;
        const y = (img.height - size) / 2;
        
        canvas.width = width;
        canvas.height = height;
        
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, x, y, size, size, 0, 0, width, height);
        
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      
      img.onload = processImage;
      img.onerror = () => reject(new Error('Failed to load image'));
      
      if (typeof file === 'string') {
        img.src = file;
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      }
    });
  };
  
  /**
   * Dosya boyutunu MB cinsinden kontrol eder
   */
  export const getFileSizeMB = (file: File | Blob): number => {
    return file.size / (1024 * 1024);
  };
  
  /**
   * Dosya boyutunu okunabilir formata çevirir
   */
  export const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };
  
  /**
   * Resim boyutlarını alır
   */
  export const getImageDimensions = (file: File | string): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      if (typeof file === 'string') {
        img.src = file;
      } else {
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target?.result as string;
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(file);
      }
    });
  };
  
  /**
   * Akıllı resim optimizasyonu
   * - Büyük resimleri sıkıştırır
   * - Küçük resimleri olduğu gibi bırakır
   * - Format dönüşümü yapar (PNG -> JPEG)
   */
  export const smartOptimizeImage = async (
    file: File,
    options?: {
      maxSizeMB?: number;
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
    }
  ): Promise<{ optimized: Blob; thumbnail: string; stats: any }> => {
    const config = {
      maxSizeMB: options?.maxSizeMB || IMAGE_CONFIG.maxSizeMB,
      maxWidth: options?.maxWidth || IMAGE_CONFIG.maxWidth,
      maxHeight: options?.maxHeight || IMAGE_CONFIG.maxHeight,
      quality: options?.quality || IMAGE_CONFIG.quality,
    };
    
    const originalSizeMB = getFileSizeMB(file);
    const dimensions = await getImageDimensions(file);
    
    let optimizedBlob: Blob = file;
    let compressionApplied = false;
    
    // Eğer dosya çok büyükse veya boyutları fazlaysa sıkıştır
    if (
      originalSizeMB > config.maxSizeMB ||
      dimensions.width > config.maxWidth ||
      dimensions.height > config.maxHeight
    ) {
      optimizedBlob = await compressImage(file, config.maxWidth, config.maxHeight, config.quality);
      compressionApplied = true;
      
      // Hala çok büyükse kaliteyi düşür
      let currentQuality = config.quality;
      while (getFileSizeMB(optimizedBlob) > config.maxSizeMB && currentQuality > 0.3) {
        currentQuality -= 0.1;
        optimizedBlob = await compressImage(file, config.maxWidth, config.maxHeight, currentQuality);
      }
    }
    
    // Thumbnail oluştur
    const thumbnail = await createThumbnail(file);
    
    // İstatistikler
    const stats = {
      original: {
        size: formatFileSize(file.size),
        sizeMB: originalSizeMB,
        width: dimensions.width,
        height: dimensions.height,
        type: file.type,
      },
      optimized: {
        size: formatFileSize(optimizedBlob.size),
        sizeMB: getFileSizeMB(optimizedBlob),
        compressionRatio: Math.round((optimizedBlob.size / file.size) * 100),
        compressionApplied,
      },
    };
    
    console.log('Image optimization stats:', stats);
    
    return { optimized: optimizedBlob, thumbnail, stats };
  };
  
  /**
   * Multiple resim optimizasyonu
   */
  export const optimizeMultipleImages = async (
    files: File[],
    onProgress?: (current: number, total: number) => void
  ): Promise<Array<{ file: File; optimized: Blob; thumbnail: string; stats: any }>> => {
    const results = [];
    
    for (let i = 0; i < files.length; i++) {
      if (onProgress) {
        onProgress(i + 1, files.length);
      }
      
      const result = await smartOptimizeImage(files[i]);
      results.push({
        file: files[i],
        ...result,
      });
    }
    
    return results;
  };