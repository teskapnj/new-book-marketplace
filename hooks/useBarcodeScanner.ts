// /hooks/useBarcodeScanner.ts
// Mobil kamera ile barcode/QR kod okuma hook'u

import { useState, useEffect, useRef, useCallback } from 'react';
import { BrowserMultiFormatReader, Result, NotFoundException } from '@zxing/library';

interface BarcodeScannerOptions {
  onScan: (code: string) => void;
  onError: (error: string) => void;
  continuous?: boolean;
  timeout?: number;
}

interface BarcodeScannerState {
  isScanning: boolean;
  isCameraReady: boolean;
  error: string | null;
  lastScannedCode: string | null;
  supportedDevices: MediaDeviceInfo[];
  selectedDeviceId: string | null;
}

export interface BarcodeScannerReturn {
  isScanning: boolean;
  isCameraReady: boolean;
  error: string | null;
  lastScannedCode: string | null;
  supportedDevices: MediaDeviceInfo[];
  selectedDeviceId: string | null;
  startScanning: (deviceId?: string) => Promise<void>;
  stopScanning: () => void;
  switchCamera: (deviceId: string) => Promise<void>;
  videoRef: React.RefObject<HTMLVideoElement>;
  isMobile: boolean;
}

export function useBarcodeScanner(options: BarcodeScannerOptions): BarcodeScannerReturn {
  const {
    onScan,
    onError,
    continuous = false,
    timeout = 30000
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
  const scanningIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Mobil cihaz kontrolü
  const checkIsMobile = useCallback((): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent || ''
    );
  }, []);

  // Kamera cihazlarını listele
  const getCameraDevices = useCallback(async (): Promise<MediaDeviceInfo[]> => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      // Mobil'de arka kamerayı tercih et
      if (checkIsMobile()) {
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
  }, [checkIsMobile]);

  // Kamera izinlerini kontrol et
  const checkCameraPermission = useCallback(async (): Promise<boolean> => {
    try {
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      return permission.state === 'granted';
    } catch (error) {
      return true;
    }
  }, []);

  // Kamera stream'ini başlat
  const startCamera = useCallback(async (deviceId?: string): Promise<boolean> => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const error = 'Bu tarayıcı kamera erişimini desteklemiyor';
        setState(prev => ({ ...prev, error }));
        onError(error);
        return false;
      }

      const hasPermission = await checkCameraPermission();
      if (!hasPermission) {
        console.log('Kamera izni belirsiz, denemeye devam ediyor...');
      }

      const devices = await getCameraDevices();
      
      if (devices.length === 0) {
        const error = 'Kamera cihazı bulunamadı';
        setState(prev => ({ ...prev, error }));
        onError(error);
        return false;
      }

      const selectedDevice = deviceId 
        ? devices.find(d => d.deviceId === deviceId) || devices[0]
        : devices[0];

      const constraints: MediaStreamConstraints[] = [
        {
          video: {
            deviceId: selectedDevice.deviceId ? { exact: selectedDevice.deviceId } : undefined,
            width: { ideal: 1920, min: 1280 },
            height: { ideal: 1080, min: 720 },
            facingMode: { ideal: 'environment' }
          },
          audio: false
        },
        {
          video: {
            deviceId: selectedDevice.deviceId ? { exact: selectedDevice.deviceId } : undefined,
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: { ideal: 'environment' }
          },
          audio: false
        },
        {
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: { ideal: 'environment' }
          },
          audio: false
        },
        {
          video: true,
          audio: false
        }
      ];

      console.log('Kamera başlatılıyor...', selectedDevice.label || 'Bilinmeyen cihaz');

      let stream = null;
      for (let i = 0; i < constraints.length; i++) {
        try {
          console.log(`Kamera ayarı ${i + 1}/${constraints.length} deneniyor...`);
          stream = await navigator.mediaDevices.getUserMedia(constraints[i]);
          break;
        } catch (err: any) {
          console.warn(`Kamera ayarı ${i + 1} başarısız:`, err.name);
          if (i === constraints.length - 1) throw err;
        }
      }
      
      if (!mountedRef.current || !stream) {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        return false;
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        
        await new Promise<void>((resolve, reject) => {
          if (!videoRef.current) {
            reject(new Error('Video element kayboldu'));
            return;
          }

          const video = videoRef.current;
          let resolved = false;

          const handleSuccess = () => {
            if (resolved) return;
            resolved = true;
            
            if (mountedRef.current) {
              setState(prev => ({
                ...prev,
                isCameraReady: true,
                error: null,
                supportedDevices: devices,
                selectedDeviceId: selectedDevice.deviceId
              }));
              console.log('Kamera hazır');
            }
            resolve();
          };

          const handleError = (error: any) => {
            if (resolved) return;
            resolved = true;
            console.error('Video setup hatası:', error);
            reject(error);
          };

          video.addEventListener('loadedmetadata', handleSuccess, { once: true });
          video.addEventListener('canplay', handleSuccess, { once: true });
          video.addEventListener('playing', handleSuccess, { once: true });
          video.addEventListener('error', handleError, { once: true });

          video.play().then(handleSuccess).catch((playError) => {
            console.warn('Autoplay başarısız:', playError);
            setTimeout(handleSuccess, 1000);
          });

          setTimeout(() => {
            if (!resolved) {
              console.log('Video timeout, devam ediyor...');
              handleSuccess();
            }
          }, 3000);
        });
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
  }, [getCameraDevices, checkCameraPermission, onError]);

  // Taramayı durdur
  const stopScanning = useCallback(() => {
    console.log('Barcode tarama durduruluyor');
    
    // Timeout'u temizle
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    // Scanning interval'ını temizle
    if (scanningIntervalRef.current) {
      clearInterval(scanningIntervalRef.current);
      scanningIntervalRef.current = null;
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

  // Barcode taramayı başlat
  const startScanning = useCallback(async (deviceId?: string): Promise<void> => {
    try {
      if (!mountedRef.current) return;

      setState(prev => ({ 
        ...prev, 
        isScanning: true, 
        error: null, 
        lastScannedCode: null 
      }));

      const cameraStarted = await startCamera(deviceId);
      if (!cameraStarted) {
        setState(prev => ({ ...prev, isScanning: false }));
        return;
      }

      const reader = new BrowserMultiFormatReader();
      readerRef.current = reader;

      console.log('Barcode tarama başlatıldı');

      if (timeout > 0) {
        timeoutRef.current = setTimeout(() => {
          if (mountedRef.current) {
            stopScanning();
            onError('Tarama zaman aşımına uğradı');
          }
        }, timeout);
      }

      const scanFromVideo = async () => {
        try {
          if (!videoRef.current || !mountedRef.current || !readerRef.current) {
            return;
          }

          if (videoRef.current.readyState < 2) {
            return;
          }

          const result = await reader.decodeFromVideo(videoRef.current);
          
          if (result && result.getText()) {
            const scannedCode = result.getText();
            console.log('Barcode okundu:', scannedCode);
            
            if (mountedRef.current) {
              setState(prev => ({ ...prev, lastScannedCode: scannedCode }));
              
              onScan(scannedCode);
              
              if (!continuous) {
                stopScanning();
                return;
              }
            }
          }
          
        } catch (error: any) {
          if (!(error instanceof NotFoundException) && error.name !== 'NotFoundException') {
            console.error('Barcode okuma hatası:', error);
          }
        }
      };

      if (continuous) {
        scanningIntervalRef.current = setInterval(scanFromVideo, 100);
      } else {
        scanFromVideo();
      }

    } catch (error: any) {
      console.error('Tarama başlatma hatası:', error);
      
      if (mountedRef.current) {
        setState(prev => ({ ...prev, isScanning: false }));
        onError('Tarama başlatılamadı');
      }
    }
  }, [startCamera, onScan, onError, continuous, timeout, stopScanning]);

  // Kamera cihazını değiştir
  const switchCamera = useCallback(async (deviceId: string): Promise<void> => {
    if (state.isScanning) {
      stopScanning();
      await new Promise(resolve => setTimeout(resolve, 500));
      await startScanning(deviceId);
    } else {
      await startCamera(deviceId);
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
    isScanning: state.isScanning,
    isCameraReady: state.isCameraReady,
    error: state.error,
    lastScannedCode: state.lastScannedCode,
    supportedDevices: state.supportedDevices,
    selectedDeviceId: state.selectedDeviceId,
    
    // Actions
    startScanning,
    stopScanning,
    switchCamera,
    
    // Refs
    videoRef,
    
    // Utils
    isMobile: checkIsMobile()
  };
}