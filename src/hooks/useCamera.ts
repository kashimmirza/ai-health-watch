import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { useState, useCallback } from 'react';

export interface CapturedImage {
  dataUrl: string;
  format: string;
  timestamp: Date;
}

export function useCamera() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [lastImage, setLastImage] = useState<CapturedImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const capturePhoto = useCallback(async (): Promise<CapturedImage | null> => {
    setIsCapturing(true);
    setError(null);

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
        width: 1280,
        height: 720,
      });

      if (image.dataUrl) {
        const capturedImage: CapturedImage = {
          dataUrl: image.dataUrl,
          format: image.format,
          timestamp: new Date(),
        };
        setLastImage(capturedImage);
        return capturedImage;
      }
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to capture image';
      setError(errorMessage);
      console.error('Camera capture error:', err);
      return null;
    } finally {
      setIsCapturing(false);
    }
  }, []);

  const pickFromGallery = useCallback(async (): Promise<CapturedImage | null> => {
    setIsCapturing(true);
    setError(null);

    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });

      if (image.dataUrl) {
        const capturedImage: CapturedImage = {
          dataUrl: image.dataUrl,
          format: image.format,
          timestamp: new Date(),
        };
        setLastImage(capturedImage);
        return capturedImage;
      }
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to pick image';
      setError(errorMessage);
      console.error('Gallery pick error:', err);
      return null;
    } finally {
      setIsCapturing(false);
    }
  }, []);

  const clearImage = useCallback(() => {
    setLastImage(null);
    setError(null);
  }, []);

  return {
    capturePhoto,
    pickFromGallery,
    clearImage,
    isCapturing,
    lastImage,
    error,
  };
}
