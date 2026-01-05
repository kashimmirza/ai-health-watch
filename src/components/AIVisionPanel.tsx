import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera as CameraIcon, ScanLine, X, Image, Loader2, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCamera, type CapturedImage } from '@/hooks/useCamera';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface AIVisionPanelProps {
  onAnalysisComplete?: (result: AnalysisResult) => void;
}

export interface AnalysisResult {
  skinCondition: string;
  confidence: number;
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  details?: string;
}

async function analyzeSkinImage(imageBase64: string): Promise<AnalysisResult> {
  const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/analyze-skin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ imageBase64 }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Analysis failed' }));
    if (response.status === 429) {
      throw new Error('Rate limit exceeded. Please try again in a moment.');
    }
    if (response.status === 402) {
      throw new Error('AI credits exhausted. Please add credits to continue.');
    }
    throw new Error(error.error || 'Failed to analyze image');
  }

  return response.json();
}

export function AIVisionPanel({ onAnalysisComplete }: AIVisionPanelProps) {
  const { capturePhoto, pickFromGallery, clearImage, isCapturing, lastImage, error } = useCamera();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [showScanner, setShowScanner] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startLivePreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 1280, height: 720 }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setShowScanner(true);
    } catch (err) {
      console.error('Failed to start camera:', err);
      // Fallback to photo capture
      handleCapture();
    }
  };

  const stopLivePreview = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setShowScanner(false);
  };

  useEffect(() => {
    return () => stopLivePreview();
  }, []);

  const handleCapture = async () => {
    stopLivePreview();
    const image = await capturePhoto();
    if (image) {
      analyzeImage(image);
    }
  };

  const handleGallery = async () => {
    const image = await pickFromGallery();
    if (image) {
      analyzeImage(image);
    }
  };

  const analyzeImage = async (image: CapturedImage) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    try {
      const result = await analyzeSkinImage(image.dataUrl);
      setAnalysisResult(result);
      onAnalysisComplete?.(result);
      
      if (result.riskLevel === 'high') {
        toast.warning('High risk detected - Please consult a healthcare professional');
      } else if (result.riskLevel === 'medium') {
        toast.info('Some concerns detected - Consider professional evaluation');
      } else {
        toast.success('Analysis complete');
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      toast.error(err instanceof Error ? err.message : 'Failed to analyze image');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    clearImage();
    setAnalysisResult(null);
    stopLivePreview();
  };

  const riskColors = {
    low: 'text-success',
    medium: 'text-warning',
    high: 'text-critical',
  };

  const riskBgColors = {
    low: 'bg-success/10',
    medium: 'bg-warning/10',
    high: 'bg-critical/10',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card rounded-xl p-4 overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <ScanLine className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">AI Skin Analysis</h3>
            <p className="text-xs text-muted-foreground">Powered by Gemini Vision</p>
          </div>
        </div>
        {(lastImage || showScanner) && (
          <Button variant="ghost" size="icon" onClick={resetAnalysis}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {showScanner ? (
          <motion.div
            key="scanner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative aspect-video rounded-lg overflow-hidden bg-muted"
          >
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-4 border-2 border-primary/50 rounded-lg">
                <motion.div
                  className="absolute left-0 right-0 h-0.5 bg-primary"
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                />
              </div>
            </div>
            <div className="absolute bottom-4 inset-x-4 flex gap-2">
              <Button onClick={handleCapture} className="flex-1">
                <CameraIcon className="w-4 h-4 mr-2" />
                Capture
              </Button>
              <Button variant="outline" onClick={stopLivePreview}>
                Cancel
              </Button>
            </div>
          </motion.div>
        ) : lastImage ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="relative aspect-video rounded-lg overflow-hidden bg-muted">
              <img
                src={lastImage.dataUrl}
                alt="Captured"
                className="w-full h-full object-cover"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">AI is analyzing your image...</p>
                    <p className="text-xs text-muted-foreground mt-1">This may take a few seconds</p>
                  </div>
                </div>
              )}
            </div>

            {analysisResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <div className={cn("flex items-center gap-2 p-3 rounded-lg", riskBgColors[analysisResult.riskLevel])}>
                  {analysisResult.riskLevel === 'low' ? (
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                  ) : (
                    <AlertTriangle className={cn('w-5 h-5 flex-shrink-0', riskColors[analysisResult.riskLevel])} />
                  )}
                  <span className="font-medium">{analysisResult.skinCondition}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Confidence:</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${analysisResult.confidence}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                  <span className="font-medium">{analysisResult.confidence.toFixed(0)}%</span>
                </div>

                {analysisResult.details && (
                  <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <p>{analysisResult.details}</p>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <p className="text-sm font-medium">Recommendations:</p>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {analysisResult.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-primary">•</span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 border-t border-border">
                  <p className="text-xs text-muted-foreground italic">
                    ⚠️ This is for educational purposes only. Always consult a healthcare professional for proper diagnosis.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="buttons"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            <div className="aspect-video rounded-lg bg-muted/50 border-2 border-dashed border-border flex flex-col items-center justify-center gap-3">
              <div className="p-4 rounded-full bg-primary/10">
                <CameraIcon className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground text-center px-4">
                Capture or upload a skin image for AI-powered analysis
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              <Button onClick={startLivePreview} disabled={isCapturing} className="w-full">
                {isCapturing ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CameraIcon className="w-4 h-4 mr-2" />
                )}
                Camera
              </Button>
              <Button variant="outline" onClick={handleGallery} disabled={isCapturing}>
                <Image className="w-4 h-4 mr-2" />
                Gallery
              </Button>
            </div>

            {error && (
              <p className="text-sm text-critical text-center">{error}</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
