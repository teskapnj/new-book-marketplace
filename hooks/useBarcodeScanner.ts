// /hooks/useBarcodeScanner.ts
// Mobile camera barcode/QR code reading hook
// 4 YÖN DESTEĞİ: 0° + 90° + 180° + 270° (explicit rotasyon)

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MultiFormatReader,
  BinaryBitmap,
  HybridBinarizer,
  RGBLuminanceSource,
  DecodeHintType,
  BarcodeFormat,
  NotFoundException
} from '@zxing/library';

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

// Performans için: analiz edilecek karenin maksimum genişliği
const MAX_ANALYSIS_WIDTH = 800;

// Rotasyon açıları (radyan cinsinden)
const ROTATIONS = [
  { angle: 0, label: '0° (normal)' },           // Düz
  { angle: Math.PI / 2, label: '90°' },         // Saat yönünde 90°
  { angle: Math.PI, label: '180° (ters)' },     // Ters
  { angle: (3 * Math.PI) / 2, label: '270°' }   // Saat yönünün tersine 90°
];

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
  const readerRef = useRef<MultiFormatReader | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mountedRef = useRef(true);
  const scanningIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isDecodingRef = useRef(false);
  const onScanRef = useRef(onScan);
  const scanCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lastScanTimeRef = useRef<number>(0);
  const lastScanCodeRef = useRef<string | null>(null);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  // Mobile device check
  const checkIsMobile = useCallback((): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent || ''
    );
  }, []);

  // List camera devices
  const getCameraDevices = useCallback(async (): Promise<MediaDeviceInfo[]> => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');

      // Prefer back camera on mobile
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
      console.error('Could not get camera devices:', error);
      return [];
    }
  }, [checkIsMobile]);

  // Check camera permissions
  const checkCameraPermission = useCallback(async (): Promise<boolean> => {
    try {
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName });
      return permission.state === 'granted';
    } catch (error) {
      return true;
    }
  }, []);

  // Start camera stream
  const startCamera = useCallback(async (deviceId?: string): Promise<boolean> => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        const error = 'This browser does not support camera access';
        setState(prev => ({ ...prev, error }));
        onError(error);
        return false;
      }

      const hasPermission = await checkCameraPermission();
      if (!hasPermission) {
        console.log('Camera permission uncertain, continuing to try...');
      }

      const devices = await getCameraDevices();

      if (devices.length === 0) {
        const error = 'No camera device found';
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

      console.log('Starting camera...', selectedDevice.label || 'Unknown device');

      let stream = null;
      for (let i = 0; i < constraints.length; i++) {
        try {
          console.log(`Trying camera settings ${i + 1}/${constraints.length}...`);
          stream = await navigator.mediaDevices.getUserMedia(constraints[i]);
          break;
        } catch (err: any) {
          console.warn(`Camera settings ${i + 1} failed:`, err.name);
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
            reject(new Error('Video element disappeared'));
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
              console.log('Camera ready');
            }
            resolve();
          };

          const handleError = (error: any) => {
            if (resolved) return;
            resolved = true;
            console.error('Video setup error:', error);
            reject(error);
          };

          video.addEventListener('loadedmetadata', handleSuccess, { once: true });
          video.addEventListener('canplay', handleSuccess, { once: true });
          video.addEventListener('playing', handleSuccess, { once: true });
          video.addEventListener('error', handleError, { once: true });

          video.play().then(handleSuccess).catch((playError) => {
            console.warn('Autoplay failed:', playError);
            setTimeout(handleSuccess, 1000);
          });

          setTimeout(() => {
            if (!resolved) {
              console.log('Video timeout, continuing...');
              handleSuccess();
            }
          }, 3000);
        });
      }

      return true;

    } catch (error: any) {
      console.error('Camera start error:', error);

      let errorMessage = 'Could not open camera';

      if (error.name === 'NotAllowedError') {
        errorMessage = 'Camera permission denied. Please allow camera access in browser settings.';
      } else if (error.name === 'NotFoundError') {
        errorMessage = 'No camera device found';
      } else if (error.name === 'NotReadableError') {
        errorMessage = 'Camera is being used by another application';
      } else if (error.name === 'OverconstrainedError') {
        errorMessage = 'Camera settings not supported';
      }

      if (mountedRef.current) {
        setState(prev => ({ ...prev, error: errorMessage, isCameraReady: false }));
        onError(errorMessage);
      }

      return false;
    }
  }, [getCameraDevices, checkCameraPermission, onError]);

  // Stop scanning
  const stopScanning = useCallback(() => {
    console.log('Stopping barcode scanning');

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (scanningIntervalRef.current) {
      clearInterval(scanningIntervalRef.current);
      scanningIntervalRef.current = null;
    }

    if (readerRef.current) {
      try {
        readerRef.current.reset();
      } catch (error) {
        console.error('Reader reset error:', error);
      }
      readerRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    isDecodingRef.current = false;
    scanCanvasRef.current = null;

    if (mountedRef.current) {
      setState(prev => ({
        ...prev,
        isScanning: false,
        isCameraReady: false
      }));
    }
  }, []);

  /**
   * Canvas'taki görüntüyü ZXing ile decode eder
   */
  const decodeCanvas = (reader: MultiFormatReader, canvas: HTMLCanvasElement): string | null => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    const { width, height } = canvas;
    const imageData = ctx.getImageData(0, 0, width, height);
    const rgba = imageData.data;

    // RGBA -> grayscale luminance
    const luminance = new Uint8ClampedArray(width * height);
    for (let i = 0, j = 0; i < rgba.length; i += 4, j++) {
      luminance[j] = (rgba[i] * 306 + rgba[i + 1] * 601 + rgba[i + 2] * 117) >> 10;
    }

    try {
      const source = new RGBLuminanceSource(luminance, width, height);
      const bitmap = new BinaryBitmap(new HybridBinarizer(source));
      const result = reader.decodeWithState(bitmap);
      return result ? result.getText() : null;
    } catch (e) {
      if (!(e instanceof NotFoundException)) {
        console.error('Decode error:', e);
      }
      return null;
    }
  };

  /**
   * Video karesini belirtilen açıda döndürerek canvas'a çizer ve decode eder
   */
  const tryDecodeWithRotation = (
    reader: MultiFormatReader,
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    angle: number
  ): string | null => {
    const isVertical = angle === Math.PI / 2 || angle === (3 * Math.PI) / 2;
    
    // Döndürülmüş karenin boyutları
    const w = isVertical ? Math.floor(video.videoHeight * (MAX_ANALYSIS_WIDTH / video.videoWidth)) 
                         : Math.floor(video.videoWidth * (MAX_ANALYSIS_WIDTH / video.videoWidth));
    const h = isVertical ? Math.floor(video.videoWidth * (MAX_ANALYSIS_WIDTH / video.videoWidth)) 
                         : Math.floor(video.videoHeight * (MAX_ANALYSIS_WIDTH / video.videoWidth));

    if (w <= 0 || h <= 0) return null;

    canvas.width = w;
    canvas.height = h;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;

    ctx.save();
    ctx.clearRect(0, 0, w, h);

    if (angle === 0) {
      // Normal - rotasyon yok
      ctx.drawImage(video, 0, 0, w, h);
    } else {
      // Rotasyon uygula
      ctx.translate(w / 2, h / 2);
      ctx.rotate(angle);
      
      // Orijinal video boyutlarını scale et
      const scaledW = isVertical ? h : w;
      const scaledH = isVertical ? w : h;
      
      ctx.drawImage(video, -scaledW / 2, -scaledH / 2, scaledW, scaledH);
    }

    ctx.restore();

    return decodeCanvas(reader, canvas);
  };

  // Start barcode scanning
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

      // Reader'ı kur - TRY_HARDER KALDIRILDI (explicit rotasyon kullanıyoruz)
      const hints = new Map();
      // TRY_HARDER'ı kaldırdık çünkü explicit 4 yön deniyoruz
      // Bu daha hızlı ve güvenilir
      hints.set(DecodeHintType.POSSIBLE_FORMATS, [
        BarcodeFormat.EAN_13,
        BarcodeFormat.EAN_8,
        BarcodeFormat.UPC_A,
        BarcodeFormat.UPC_E,
        BarcodeFormat.CODE_128,
      ]);

      const reader = new MultiFormatReader();
      reader.setHints(hints);
      readerRef.current = reader;

      // Tek canvas - her rotasyonda yeniden kullanılacak
      const canvas = document.createElement('canvas');
      scanCanvasRef.current = canvas;

      console.log('Barcode scanning started (4-direction mode)');

      if (timeout > 0) {
        timeoutRef.current = setTimeout(() => {
          if (mountedRef.current) {
            stopScanning();
            onError('Scanning timed out');
          }
        }, timeout);
      }

      const scanFromVideo = () => {
        if (isDecodingRef.current) return;

        try {
          if (!videoRef.current || !mountedRef.current || !readerRef.current || !scanCanvasRef.current) {
            return;
          }

          const video = videoRef.current;
          if (video.readyState < 2 || !video.videoWidth) {
            return;
          }

          isDecodingRef.current = true;

          let scannedCode: string | null = null;
          let successAngle = '';

          // TÜM 4 YÖNÜ DENE
          for (const rotation of ROTATIONS) {
            scannedCode = tryDecodeWithRotation(
              readerRef.current,
              video,
              scanCanvasRef.current,
              rotation.angle
            );

            if (scannedCode) {
              successAngle = rotation.label;
              console.log(`✅ Barcode found at ${successAngle}:`, scannedCode);
              break;
            }
          }

          if (scannedCode) {
            const now = Date.now();
            const isSameCodeTooSoon = 
              lastScanCodeRef.current === scannedCode && 
              (now - lastScanTimeRef.current) < 2500; // aynı barkod 2.5 sn içinde tekrar sayılmaz

            if (!isSameCodeTooSoon && mountedRef.current) {
              lastScanTimeRef.current = now;
              lastScanCodeRef.current = scannedCode;

              setState(prev => ({ ...prev, lastScannedCode: scannedCode }));
              onScanRef.current(scannedCode);
              
              if (!continuous) {
                stopScanning();
                return;
              }
            }
          }
        } catch (error: any) {
          if (!(error instanceof NotFoundException) && error?.name !== 'NotFoundException') {
            console.error('Barcode reading error:', error);
          }
        } finally {
          isDecodingRef.current = false;
        }
      };

      // 4 yön denendiği için interval'i biraz hızlandırdık
      scanningIntervalRef.current = setInterval(scanFromVideo, 150);

    } catch (error: any) {
      console.error('Scanning start error:', error);

      if (mountedRef.current) {
        setState(prev => ({ ...prev, isScanning: false }));
        onError('Could not start scanning');
      }
    }
  }, [startCamera, onScan, onError, continuous, timeout, stopScanning]);

  // Switch camera device
  const switchCamera = useCallback(async (deviceId: string): Promise<void> => {
    if (state.isScanning) {
      stopScanning();
      await new Promise(resolve => setTimeout(resolve, 500));
      await startScanning(deviceId);
    } else {
      await startCamera(deviceId);
    }
  }, [state.isScanning, stopScanning, startScanning, startCamera]);

  // Cleanup on component unmount
  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      stopScanning();
    };
  }, [stopScanning]);

  // Get device list on mount
  useEffect(() => {
    getCameraDevices().then(devices => {
      if (mountedRef.current) {
        setState(prev => ({ ...prev, supportedDevices: devices }));
      }
    });
  }, [getCameraDevices]);

  return {
    isScanning: state.isScanning,
    isCameraReady: state.isCameraReady,
    error: state.error,
    lastScannedCode: state.lastScannedCode,
    supportedDevices: state.supportedDevices,
    selectedDeviceId: state.selectedDeviceId,
    startScanning,
    stopScanning,
    switchCamera,
    videoRef,
    isMobile: checkIsMobile()
  };
}