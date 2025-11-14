import React, { useEffect, useRef, useState } from 'react';
import type { NormalizedNameplate, OcrStatus } from '../types';
import { Card } from '../components/Card';
import { runOcrOnImage } from '../ocr/ocrPipeline';
import { parseMotorFields } from '../ocr/parse';

interface Props {
  onScanComplete: (scan: NormalizedNameplate) => void;
}

export const ScanScreen: React.FC<Props> = ({ onScanComplete }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [status, setStatus] = useState<OcrStatus>('detecting-plate');
  const [error, setError] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);

  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

    const startCamera = async () => {
    try {
        setError(null);
        setCameraActive(true);             // 👈 render the <video> first

        const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
        });

        streamRef.current = stream;

        // by now the video element exists and ref is set
        if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStatus('detecting-plate');
        }
    } catch (e) {
        console.error(e);
        setError('Camera access denied. You can upload an image instead.');
        setStatus('error');
        setCameraActive(false);
    }
    };


  const captureFrame = async () => {
    if (!videoRef.current || isBusy) return;
    try {
      setIsBusy(true);
      setStatus('capturing');

      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      const vw = video.videoWidth || 1280;
      const vh = video.videoHeight || 720;
      canvas.width = vw;
      canvas.height = vh;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No canvas context');
      ctx.drawImage(video, 0, 0, vw, vh);

      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.9);
      await handleImage(imageDataUrl);
    } catch (e) {
      console.error(e);
      setError('Unable to capture or read plate. Try again.');
      setStatus('error');
    } finally {
      setIsBusy(false);
    }
  };

  const uploadImage = () => {
    if (isBusy) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        await handleImage(dataUrl);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  };

  const handleImage = async (imageDataUrl: string) => {
    try {
      setIsBusy(true);
      setStatus('processing');
      const ocr = await runOcrOnImage(imageDataUrl);
      const parsed = parseMotorFields(ocr);

      const scan: NormalizedNameplate = {
        id: crypto.randomUUID(),
        imageDataUrl,
        rawText: parsed.rawText,
        ocrConfidence: parsed.ocrConfidence,
        hp: parsed.hp,
        rpm: parsed.rpm,
        frame: parsed.frame,
        catalogNumber: parsed.catalogNumber,
        specNumber: parsed.specNumber,
        typeCode: parsed.typeCode,
        enclosure: parsed.enclosure,
        armVolts: parsed.armVolts,
        armAmps: parsed.armAmps,
        fieldVolts: parsed.fieldVolts,
        fieldAmps: parsed.fieldAmps,
        voltage: parsed.voltage,
        manufacturer: parsed.manufacturer,
        serialNumber: parsed.serialNumber,
        bearings: parsed.bearings,
        brushCode: parsed.brushCode,
        createdAt: new Date().toISOString(),
        offline: !navigator.onLine,
      };

      setStatus('done');
      onScanComplete(scan);
    } catch (e) {
      console.error(e);
      setError('Unable to process image.');
      setStatus('error');
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <Card
      title="Capture nameplate"
      subtitle="Take a photo of the motor nameplate or upload an existing image."
      right={
        <span className="badge" aria-live="polite">
          {status === 'processing'
            ? 'Reading plate…'
            : status === 'capturing'
            ? 'Capturing…'
            : status === 'error'
            ? 'Scan error'
            : 'Ready'}
        </span>
      }
    >
      <div className="capture-panel">
        {cameraActive ? (
          <video
            ref={videoRef}
            className="capture-video"
            muted
            playsInline
            aria-label="Camera preview"
          />
        ) : (
          <div style={{ textAlign: 'center', fontSize: 14 }}>
            Camera not active
            <div style={{ fontSize: 12, color: '#aaa', marginTop: 4 }}>
              Click “Start camera” or upload an image.
            </div>
          </div>
        )}
      </div>

      {error && (
        <div
          style={{
            marginTop: 10,
            padding: 8,
            borderRadius: 8,
            background: '#4a2626',
            border: '1px solid rgba(255,255,255,0.12)',
            fontSize: 12,
          }}
        >
          {error}
        </div>
      )}

      <div className="flex mt-16 gap-16">
        <button
          className="btn btn-primary"
          onClick={cameraActive ? captureFrame : startCamera}
          disabled={isBusy}
        >
          {cameraActive ? 'Capture photo' : 'Start camera'}
        </button>
        <button className="btn btn-secondary" onClick={uploadImage} disabled={isBusy}>
          Upload image
        </button>
      </div>
    </Card>
  );
};
