import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const QRScanner = ({ onScanSuccess, onScanError }) => {
  const scannerRef = useRef(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current
          .stop()
          .then(() => {
            html5QrCodeRef.current.clear();
          })
          .catch((err) => {
            console.error('Error stopping scanner:', err);
          });
      }
    };
  }, []);

  const startScanning = async () => {
    try {
      setError(null);
      const html5QrCode = new Html5Qrcode('qr-reader');
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: 'environment' }, // Back camera on mobile
        {
          fps: 10,
          qrbox: function(viewfinderWidth, viewfinderHeight) {
            // Responsive QR box - larger on mobile
            const minEdgePercentage = 0.7; // 70% of the smaller edge
            const minEdgeSize = Math.min(viewfinderWidth, viewfinderHeight);
            const qrboxSize = Math.floor(minEdgeSize * minEdgePercentage);
            return {
              width: qrboxSize,
              height: qrboxSize
            };
          },
        },
        (decodedText) => {
          onScanSuccess(decodedText);
          stopScanning();
        },
        (errorMessage) => {
          // Ignore continuous errors
        }
      );

      setIsScanning(true);
    } catch (err) {
      setError('Failed to start camera. Please check permissions.');
      onScanError(err);
    }
  };

  const stopScanning = async () => {
    try {
      if (html5QrCodeRef.current) {
        await html5QrCodeRef.current.stop();
        html5QrCodeRef.current.clear();
        html5QrCodeRef.current = null;
      }
      setIsScanning(false);
    } catch (err) {
      console.error('Error stopping scanner:', err);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        id="qr-reader"
        className="w-full rounded-lg overflow-hidden bg-black"
        style={{ minHeight: '400px' }}
      ></div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mt-4 flex justify-center space-x-4">
        {!isScanning ? (
          <button
            onClick={startScanning}
            className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Start Scanning
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Stop Scanning
          </button>
        )}
      </div>
    </div>
  );
};

export default QRScanner;

