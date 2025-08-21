// /hooks/useBarcodeScanner.ts
// Mobil kamera ile barcode/QR kod okuma hook'u

import { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserMultiFormatReader, Result, NotFoundException } from '@zxing/library';

interface BarcodeScannerOptions {
  onScan: (code: string) => void;
  onError: (error: string) => void;
  continuous?: boolean; // Sürekli tarama modu
  timeout?: number; // Tarama timeout (ms)
}

interface BarcodeScannerState {
  isScanning: boolean;
  isCameraReady: boolean;
  error: string | null;
  lastScannedCode: string | null;
  supportedDevices: MediaDeviceInfo[];
  selectedDeviceId: string | null;
}

export function useBarcodeScanner(options: BarcodeScannerOptions) {
  const {
    onScan,
    onError,
    continuous = false,
    timeout = 30000 // 30 saniye default timeout
  } = options;

  // State
  const [state, setState] = useState<BarcodeScannerState>({
    isScanning: false,
    isCameraReady: false,
    error: null,
    lastScannedCode: null,
    supportedDevices: [],
    selectedDeviceId: null
  });

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const readerRef = useRef<BrowserMultiFormatReader | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);

  // Mobil cihaz kontrolü
  const isMobile = useCallback(() => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  }, []);

  // Kamera cihazlarını listele
  const getCameraDevices = useCallback(async (): Promise<MediaDeviceInfo[]> => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      // Mobil'de arka kamerayı tercih et
      if (isMobile()) {
        videoDevices.sort((a, b) => {
          const aIsBack = a.label.toLowerCase().includes('back') || 
                         a.label.toLowerCase().includes('rear') ||
                         a.label.toLowerCase().includes('environment');
          const bIsBack = b.label.toLowerCase().includes('back') || 
                         b.label.toLowerCase().includes('rear') ||
                         b.label.toLowerCase().includes('environment');
          
          if (aIsBack && !bIsBack) return -1;
          if (!aIsBack && bIsBack) return 1;
          return 0;
        });
      }
      
      return videoDevices;
    } catch (error) {
      console.error('Kamera cihazları alınamadı:', error);
      return [];
    }
  }, [isMobile]);

  // Kamera izinlerini kontrol et
  const checkCameraPermission = useCallback(async (): Promise<boolean> => {
    try {
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      return permission.state === 'granted';
    } catch (error) {
      // Eski browser'larda permissions API olmayabilir
      return true;
    }
  }, []);

  // Kamera stream'ini başlat
  const startCamera = useCallback(async (deviceId?: string) => {
    try {
      // Mobil cihaz kontrolü
      if (!isMobile()) {
        const error = 'Bu özellik sadece mobil cihazlarda çalışır';
        setState(prev => ({ ...prev, error }));
        onError(error);
        return false;
      }

      // MediaDevices API desteği kontrolü
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const error = 'Bu tarayıcı kamera erişimini desteklemiyor';
        setState(prev => ({ ...prev, error }));
        onError(error);
        return false;
      }

      // Kamera izinlerini kontrol et
      const hasPermission = await checkCameraPermission();
      if (!hasPermission) {
        // İzin olmasa bile getUserMedia ile deneyebiliriz
        console.log('Kamera izni belirsiz, denemeye devam ediyor...');
      }

      // Cihaz listesini al
      const devices = await getCameraDevices();
      
      if (devices.length === 0) {
        const error = 'Kamera cihazı bulunamadı';
        setState(prev => ({ ...prev, error }));
        onError(error);
        return false;
      }

      // Kullanılacak cihazı seç
      const selectedDevice = deviceId 
        ? devices.find(d => d.deviceId === deviceId) || devices[0]
        : devices[0]; // İlk cihaz (genelde arka kamera)

      // Kamera ayarları
      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: selectedDevice.deviceId ? { exact: selectedDevice.deviceId } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: isMobile() ? { ideal: 'environment' } : undefined // Arka kamera
        },
        audio: false
      };

      console.log('🎥 Kamera başlatılıyor...', selectedDevice.label || 'Bilinmeyen cihaz');

      // Kamera stream'ini al
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (!mountedRef.current) {
        // Component unmount olduysa stream'i kapat
        stream.getTracks().forEach(track => track.stop());
        return false;
      }

      // Video element'ine stream'i ata
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        // Video yüklendiğinde state'i güncelle
        videoRef.current.onloadedmetadata = () => {
          if (mountedRef.current) {
            setState(prev => ({
              ...prev,
              isCameraReady: true,
              error: null,
              supportedDevices: devices,
              selectedDeviceId: selectedDevice.deviceId
            }));
            console.log('✅ Kamera hazır');
          }
        };

        // Video'yu oynat
        await videoRef.current.play();
      }

      return true;

    } catch (error: any) {
      console.error('Kamera başlatma hatası:', error);
      
      let errorMessage = 'Kamera açılamadı';
      
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Kamera izni reddedildi. Lütfen tarayıcı ayarlarından kamera iznini verin.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'Kamera cihazı bulunamadı';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Kamera başka bir uygulama tarafından kullanılıyor';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Kamera ayarları desteklenmiyor';
      }

      if (mountedRef.current) {
        setState(prev => ({ ...prev, error: errorMessage, isCameraReady: false }));
        onError(errorMessage);
      }
      
      return false;
    }
  }, [isMobile, getCameraDevices, checkCameraPermission, onError]);

  // Barcode taramayı başlat
  const startScanning = useCallback(async (deviceId?: string) => {
    try {
      if (!mountedRef.current) return;

      setState(prev => ({ 
        ...prev, 
        isScanning: true, 
        error: null, 
        lastScannedCode: null 
      }));

      // Kamerayı başlat
      const cameraStarted = await startCamera(deviceId);
      if (!cameraStarted) {
        setState(prev => ({ ...prev, isScanning: false }));
        return;
      }

      // ZXing code reader'ı başlat
      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      console.log('🔍 Barcode tarama başlatıldı');

      // Timeout ayarla
      if (timeout > 0) {
        timeoutRef.current = setTimeout(() => {
          if (mountedRef.current) {
            stopScanning();
            onError('Tarama zaman aşımına uğradı');
          }
        }, timeout);
      }

      // Tarama döngüsü
      const scanFromVideo = async () => {
        try {
          if (!videoRef.current || !mountedRef.current || !state.isScanning) {
            return;
          }

          const result = await reader.decodeOnceFromVideoDevice(undefined, videoRef.current);
          
          if (result && result.getText()) {
            const scannedCode = result.getText();
            console.log('📱 Barcode okundu:', scannedCode);
            
            if (mountedRef.current) {
              setState(prev => ({ ...prev, lastScannedCode: scannedCode }));
              
              // Callback'i çağır
              onScan(scannedCode);
              
              // Sürekli tarama modunda değilse durdur
              if (!continuous) {
                stopScanning();
              }
            }
          }
          
        } catch (error: any) {
          // NotFoundException normal - kod bulunamadı anlamında
          if (!(error instanceof NotFoundException)) {
            console.error('Barcode okuma hatası:', error);
            
            if (mountedRef.current) {
              stopScanning();
              onError('Barcode okuma hatası');
            }
          }
          
          // Sürekli tarama modunda tekrar dene
          if (continuous && mountedRef.current && state.isScanning) {
            setTimeout(scanFromVideo, 100);
          }
        }
      };

      // Taramayı başlat
      scanFromVideo();

    } catch (error: any) {
      console.error('Tarama başlatma hatası:', error);
      
      if (mountedRef.current) {
        setState(prev => ({ ...prev, isScanning: false }));
        onError('Tarama başlatılamadı');
      }
    }
  }, [startCamera, onScan, onError, continuous, timeout, state.isScanning]);

  // Taramayı durdur
  const stopScanning = useCallback(() => {
    console.log('🛑 Barcode tarama durduruluyor');
    
    // Timeout'u temizle
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Reader'ı durdur
    if (readerRef.current) {
      try {
        readerRef.current.reset();
      } catch (error) {
        console.error('Reader reset hatası:', error);
      }
      readerRef.current = null;
    }

    // Video stream'ini durdur
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }

    // Video element'ini temizle
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (mountedRef.current) {
      setState(prev => ({
        ...prev,
        isScanning: false,
        isCameraReady: false
      }));
    }
  }, []);

  // Kamera cihazını değiştir
  const switchCamera = useCallback(async (deviceId: string) => {
    if (state.isScanning) {
      stopScanning();
      await new Promise(resolve => setTimeout(resolve, 500)); // Kısa bekleme
      startScanning(deviceId);
    } else {
      startCamera(deviceId);
    }
  }, [state.isScanning, stopScanning, startScanning, startCamera]);

  // Component unmount olduğunda temizlik
  useEffect(() => {
    mountedRef.current = true;
    
    return () => {
      mountedRef.current = false;
      stopScanning();
    };
  }, [stopScanning]);

  // Cihaz listesini başlangıçta al
  useEffect(() => {
    getCameraDevices().then(devices => {
      if (mountedRef.current) {
        setState(prev => ({ ...prev, supportedDevices: devices }));
      }
    });
  }, [getCameraDevices]);

  return {
    // State
    ...state,
    
    // Actions
    startScanning,
    stopScanning,
    switchCamera,
    
    // Refs
    videoRef,
    
    // Utils
    isMobile: isMobile()
  };
}