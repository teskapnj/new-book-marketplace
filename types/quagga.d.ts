// types/quagga.d.ts
declare module 'quagga' {
    interface QuaggaJSConfigObject {
      inputStream: {
        name: string;
        type: string;
        target: HTMLVideoElement | string;
        constraints?: MediaTrackConstraints;
      };
      locator?: {
        patchSize?: 'small' | 'medium' | 'large';
        halfSample?: boolean;
      };
      numOfWorkers?: number;
      decoder: {
        readers: string[];
      };
      locate?: boolean;
    }
  
    interface QuaggaJSResultObject {
      codeResult: {
        code: string;
        format: string;
      };
    }
  
    interface QuaggaJSStatic {
      init(config: QuaggaJSConfigObject, callback: (err: any) => void): void;
      start(): void;
      stop(): void;
      offDetected(): void;
      onDetected(callback: (data: QuaggaJSResultObject) => void): void;
      onProcessed(callback: (data: any) => void): void;
      offProcessed(): void;
    }
  
    const Quagga: QuaggaJSStatic;
    export default Quagga;
  }
  
  declare global {
    interface Window {
      Quagga: QuaggaJSStatic;
    }
  }