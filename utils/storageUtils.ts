// utils/storageUtils.ts
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { storage } from "@/lib/firebase";

/**
 * Base64 string'i Blob'a çevirir
 */
export const base64ToBlob = (base64: string): Blob => {
  // data:image/jpeg;base64, kısmını kaldır
  const base64Data = base64.includes(',') ? base64.split(',')[1] : base64;
  
  try {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    
    // MIME type'ı bul
    let mimeType = 'image/jpeg'; // default
    if (base64.includes('data:')) {
      const matches = base64.match(/data:([^;]+);/);
      if (matches && matches[1]) {
        mimeType = matches[1];
      }
    }
    
    return new Blob([byteArray], { type: mimeType });
  } catch (error) {
    console.error("Error converting base64 to blob:", error);
    throw new Error("Invalid base64 string");
  }
};

/**
 * Tek bir resmi Firebase Storage'a yükler
 */
export const uploadSingleImage = async (
  image: File | string,
  storagePath: string
): Promise<string> => {
  try {
    console.log(`Uploading image to path: ${storagePath}`);
    
    let blob: Blob;
    
    if (typeof image === 'string') {
      // Base64 string ise blob'a çevir
      blob = base64ToBlob(image);
    } else {
      // File objesi ise direkt kullan
      blob = image;
    }
    
    // Storage referansı oluştur
    const storageRef = ref(storage, storagePath);
    
    // Yükle
    const snapshot = await uploadBytes(storageRef, blob);
    console.log('Upload successful:', snapshot.metadata.fullPath);
    
    // Download URL'ini al
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Download URL:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

/**
 * Listing için benzersiz storage path oluşturur
 */
export const generateImagePath = (userId: string, isbn: string): string => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(7);
  return `listings/${userId}/${timestamp}_${isbn}_${randomString}.jpg`;
};

/**
 * Birden fazla resmi yükler
 */
export const uploadMultipleImages = async (
  items: Array<{ isbn: string; image: string | File | null }>,
  userId: string
): Promise<Array<{ isbn: string; imageUrl: string | null }>> => {
  const uploadPromises = items.map(async (item) => {
    if (!item.image) {
      return { isbn: item.isbn, imageUrl: null };
    }
    
    try {
      const imagePath = generateImagePath(userId, item.isbn);
      const imageUrl = await uploadSingleImage(item.image, imagePath);
      return { isbn: item.isbn, imageUrl };
    } catch (error) {
      console.error(`Failed to upload image for ISBN ${item.isbn}:`, error);
      return { isbn: item.isbn, imageUrl: null };
    }
  });
  
  const results = await Promise.all(uploadPromises);
  return results;
};

/**
 * Storage'dan resim siler (opsiyonel - temizlik için)
 */
export const deleteImage = async (imagePath: string): Promise<void> => {
  try {
    const storageRef = ref(storage, imagePath);
    await deleteObject(storageRef);
    console.log(`Image deleted: ${imagePath}`);
  } catch (error) {
    console.error("Error deleting image:", error);
    // Silme hatası kritik değil, devam et
  }
};

/**
 * Resim boyutunu kontrol eder
 */
export const validateImageSize = (file: File, maxSizeMB: number = 5): boolean => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
};

/**
 * Resim formatını kontrol eder
 */
export const validateImageType = (file: File): boolean => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  return allowedTypes.includes(file.type);
};