import React, { useRef, useEffect, useState } from "react";

interface CameraCaptureProps {
  onCapture: (photoData: string) => void;
  onCancel: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  onCancel,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  // Initialize camera
  useEffect(() => {
    let stream: MediaStream | null = null;

    const startCamera = async () => {
      try {
        // Stop any existing stream
        if (videoRef.current && videoRef.current.srcObject) {
          const oldStream = videoRef.current.srcObject as MediaStream;
          oldStream.getTracks().forEach((track) => track.stop());
        }

        // Start a new stream with the selected camera
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: isFrontCamera ? "user" : "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraReady(true);
          setCameraError(null);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setCameraError(
          "Could not access camera. Please ensure you have granted camera permissions."
        );
        setCameraReady(false);
      }
    };

    startCamera();

    // Cleanup function to stop camera when component unmounts
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isFrontCamera]);

  // Handle photo capture
  const capturePhoto = () => {
    // Start countdown
    setCountdown(3);

    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);

          // Take the photo when countdown reaches 0
          if (prev === 1) {
            takePhoto();
          }
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Take the actual photo
  const takePhoto = () => {
    if (videoRef.current && canvasRef.current && cameraReady) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw video frame to canvas
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to data URL
        const photoData = canvas.toDataURL("image/jpeg");
        onCapture(photoData);
      }
    }
  };

  // Switch between front and back camera
  const switchCamera = () => {
    setIsFrontCamera((prev) => !prev);
  };

  return (
    <div className="relative w-full max-w-md mx-auto font-serif italic">
      {/* Camera view */}
      <div className="relative aspect-[4/5] bg-chardon-100 rounded-md overflow-hidden">
        {cameraError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-chardon-100">
            <p className="text-reds-400 text-lg font-serif text-center p-4">
              {cameraError}
            </p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {countdown && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 bg-opacity-50">
                <span className="text-white text-7xl font-bold">
                  {countdown}
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Hidden canvas for processing the image */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Camera controls */}
      <div className="mt-4 flex justify-between">
        <button onClick={onCancel} className="px-4 py-2 transition-colors">
          cancel
        </button>

        <button
          onClick={switchCamera}
          disabled={!cameraReady}
          className="px-4 py-2 bg-transparent text-redz-700 rounded-md hover:bg-redz-50 transition-colors disabled:opacity-50"
        >
          switch camera
        </button>

        <button
          onClick={capturePhoto}
          disabled={!cameraReady || countdown !== null}
          className="px-4 py-2 bg-redz-700 text-white rounded-md hover:bg-redz-800 transition-colors disabled:opacity-50"
        >
          {countdown ? `taking photo in ${countdown}...` : "take photo"}
        </button>
      </div>
    </div>
  );
};

export default CameraCapture;
