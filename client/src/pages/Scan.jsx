import { useState } from 'react';
import toast from 'react-hot-toast';
import { verifyQRCode } from '../services/apiService';
import QRScanner from '../components/QRScanner';

const Scan = () => {
  const [verificationResult, setVerificationResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleScanSuccess = async (decodedText) => {
    setLoading(true);
    setVerificationResult(null);

    try {
      const response = await verifyQRCode(decodedText);
      setVerificationResult(response);
      
      if (response.data.status === 'success') {
        toast.success('Entry verified successfully!');
      } else if (response.data.status === 'duplicate') {
        toast.error('QR code already scanned!');
      } else {
        toast.error('Invalid QR code!');
      }
    } catch (error) {
      setVerificationResult({
        status: 'error',
        message: error.response?.data?.message || 'Verification failed',
      });
      toast.error('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleScanError = (error) => {
    console.error('Scan error:', error);
  };

  const getStatusCard = () => {
    if (!verificationResult) return null;

    const { status, data, message } = verificationResult;

    if (status === 'success') {
      return (
        <div className="mt-6 p-6 bg-green-50 border-2 border-green-500 rounded-lg">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-800 mb-2">
              Entry Verified!
            </h2>
            {data.maxEntries !== undefined && data.usedEntries !== undefined && (
              <p className="text-green-700 font-semibold mb-4">
                Used {data.usedEntries} of {data.maxEntries} allowed entries
                {data.remainingEntries > 0
                  ? ` • ${data.remainingEntries} more can enter with this QR`
                  : ' • No more entries allowed with this QR'}
              </p>
            )}
            {data.entryDays && Array.isArray(data.entryDays) && data.entryDays.length > 0 && (
              <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm font-semibold text-blue-800 mb-2">Entry Days:</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {data.entryDays.map((day, index) => (
                    <span
                      key={index}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        day === data.today
                          ? 'bg-green-200 text-green-800 border-2 border-green-400'
                          : 'bg-blue-200 text-blue-800'
                      }`}
                    >
                      {new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {day === data.today && ' (Today)'}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-2 text-left bg-white p-4 rounded mt-4">
              <p>
                <span className="font-semibold">Name:</span> {data.fullName}
              </p>
              <p>
                <span className="font-semibold">Code:</span> {data.attendeeCode}
              </p>
              <p>
                <span className="font-semibold">Designation:</span> {data.designation}
              </p>
              <p>
                <span className="font-semibold">Entry Time:</span>{' '}
                {new Date(data.entryTime).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (status === 'duplicate') {
      const isDailyDuplicate = message && message.includes('Already entered today');
      return (
        <div className="mt-6 p-6 bg-red-50 border-2 border-red-500 rounded-lg">
          <div className="text-center">
            <div className="text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-red-800 mb-2">
              {isDailyDuplicate ? 'Already Entered Today!' : 'Already Scanned!'}
            </h2>
            {data && (
              <>
                <p className="text-red-700 mb-4">
                  {isDailyDuplicate 
                    ? message || 'One entry per day allowed. Please try again tomorrow.'
                    : 'All registered members already entered with this QR.'}
                </p>
                {data.entryDays && Array.isArray(data.entryDays) && data.entryDays.length > 0 && (
                  <div className="mb-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-sm font-semibold text-yellow-800 mb-2">Previous Entry Days:</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {data.entryDays.map((day, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            day === data.today
                              ? 'bg-red-200 text-red-800 border-2 border-red-400'
                              : 'bg-yellow-200 text-yellow-800'
                          }`}
                        >
                          {new Date(day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          {day === data.today && ' (Today)'}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="mt-4 text-left bg-white p-4 rounded">
                  <p>
                    <span className="font-semibold">Name:</span> {data.fullName}
                  </p>
                  <p>
                    <span className="font-semibold">Code:</span> {data.attendeeCode}
                  </p>
                  {data.maxEntries !== undefined && data.usedEntries !== undefined && (
                    <p>
                      <span className="font-semibold">Entries Used:</span>{' '}
                      {data.usedEntries} / {data.maxEntries}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="mt-6 p-6 bg-red-50 border-2 border-red-500 rounded-lg">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-red-800 mb-2">
            Invalid QR Code
          </h2>
          <p className="text-red-700">{message || 'QR code not found'}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-4 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-4 sm:mb-8">
            QR Code Scanner
          </h1>

          <QRScanner onScanSuccess={handleScanSuccess} onScanError={handleScanError} />

          {loading && (
            <div className="mt-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-2 text-gray-600">Verifying...</p>
            </div>
          )}

          {getStatusCard()}

          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Point your camera at the QR code to scan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Scan;

