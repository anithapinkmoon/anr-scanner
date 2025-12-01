import QRCode from 'qrcode';

export const generateQRCode = async (attendeeCode) => {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(attendeeCode, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.92,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      width: 300,
    });
    return qrCodeDataURL;
  } catch (error) {
    throw new Error(`QR Code generation failed: ${error.message}`);
  }
};

