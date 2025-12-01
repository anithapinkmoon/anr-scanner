const QRCard = ({ qrCode, attendeeCode, fullName, designation, onDownload }) => {
  const downloadQR = () => {
    // Create a meaningful filename: Name_Code_Designation.png
    // Example: John_Doe_GJ25-STU-ABC123_Student.png
    const sanitizedName = fullName.replace(/[^a-zA-Z0-9]/g, '_').replace(/\s+/g, '_');
    const filename = `${sanitizedName}_${attendeeCode}_${designation}.png`;
    
    const link = document.createElement('a');
    link.href = qrCode;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Registration Successful! 🎉
        </h2>
        <p className="text-gray-600 mb-6">
          Your QR code has been generated. Please save it for entry.
        </p>

        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-600 mb-2">Attendee Code</p>
          <p className="text-lg font-mono font-bold text-primary-600">
            {attendeeCode}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4">
          <img
            src={qrCode}
            alt="QR Code"
            className="w-full max-w-xs mx-auto"
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-600">Name</p>
          <p className="text-lg font-semibold text-gray-800">{fullName}</p>
        </div>

        <button
          onClick={downloadQR}
          className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
        >
          Download QR Code
        </button>

        <p className="text-xs text-gray-500 mt-4">
          File will be saved as: <span className="font-mono text-xs">{fullName.replace(/[^a-zA-Z0-9]/g, '_').replace(/\s+/g, '_')}_{attendeeCode}_{designation}.png</span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          Please keep this QR code safe. You'll need it for entry.
        </p>
      </div>
    </div>
  );
};

export default QRCard;

