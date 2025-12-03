import { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';

const InvitationCard = ({ qrCode, attendeeCode, fullName, email, phone, designation, passedOutYear, profilePhoto, eventName = "Diamond Jubilee Event", eventDate = "2025", eventDateStart, eventDateEnd, eventVenue = "Main Campus", selectedDays = [] }) => {
  const cardRef = useRef(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const qrImageRef = useRef(null);
  const qrWrapperRef = useRef(null);
  const photoImageRef = useRef(null);

  useEffect(() => {
    const preloadImages = async () => {
      const promises = [];

      if (qrCode) {
        const qrImg = new Image();
        promises.push(
          new Promise((resolve) => {
            qrImg.onload = () => resolve();
            qrImg.onerror = () => resolve();
            qrImg.src = qrCode;
          })
        );
      }

      if (profilePhoto) {
        const photoImg = new Image();
        promises.push(
          new Promise((resolve) => {
            photoImg.onload = () => resolve();
            photoImg.onerror = () => resolve();
            photoImg.src = profilePhoto;
          })
        );
      }

      await Promise.all(promises);
      setImagesLoaded(true);
    };

    preloadImages();
  }, [qrCode, profilePhoto]);

  const downloadCard = async () => {
    if (!cardRef.current || !qrCode) {
      alert('Missing card or QR code data');
      return;
    }

    try {
      // Wait for QR image to be fully loaded
      const qrImg = qrImageRef.current;
      if (!qrImg) {
        alert('QR code element not found');
        return;
      }

      if (!qrImg.complete || qrImg.naturalHeight === 0) {
        await new Promise((resolve) => {
          const timeout = setTimeout(() => {
            resolve();
          }, 5000);
          qrImg.onload = () => {
            clearTimeout(timeout);
            resolve();
          };
          qrImg.onerror = () => {
            clearTimeout(timeout);
            resolve();
          };
        });
      }

      await new Promise(resolve => setTimeout(resolve, 500));

      // Capture with html2canvas
      const cardElement = cardRef.current;
      const cardWidth = cardElement.offsetWidth;
      const cardHeight = cardElement.scrollHeight;

      const canvas = await html2canvas(cardElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        width: cardWidth,
        height: cardHeight,
        scrollX: 0,
        scrollY: -window.scrollY,
        windowWidth: document.documentElement.clientWidth,
        windowHeight: document.documentElement.clientHeight,
      });

      // ALWAYS manually draw QR code to ensure it appears
      if (qrImg && qrImg.complete && qrImg.naturalWidth > 0) {
        const ctx = canvas.getContext('2d');

        // Get positions
        const cardRect = cardRef.current.getBoundingClientRect();
        const qrRect = qrImg.getBoundingClientRect();
        const scale = 2;

        const x = (qrRect.left - cardRect.left) * scale;
        const y = (qrRect.top - cardRect.top) * scale;
        const w = qrRect.width * scale;
        const h = qrRect.height * scale;

        // Draw QR code
        ctx.save();
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(qrImg, x, y, w, h);
        ctx.restore();
      }

      // Download
      const filename = `${fullName.replace(/[^a-zA-Z0-9]/g, '_')}_${attendeeCode}_${designation}_Invitation.png`;
      const link = document.createElement('a');
      link.href = canvas.toDataURL('image/png', 1.0);
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      alert('Download failed. Please check console for details.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Preview Card */}
      <div
        ref={cardRef}
        className="bg-white rounded-lg shadow-2xl overflow-hidden relative"
        style={{
          width: '550px',
          minHeight: '450px',
          position: 'relative',
          display: 'block',
          visibility: 'visible',
          opacity: 1
        }}
      >
        {/* Geometric Background Patterns */}
        <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.05 }}>
          {/* Dashed lines */}
          <svg className="absolute top-20 left-10" width="40" height="40" viewBox="0 0 40 40">
            <line x1="0" y1="20" x2="40" y2="20" stroke="#4f46e5" strokeWidth="1" strokeDasharray="2,2" />
          </svg>
          <svg className="absolute top-32 right-16" width="30" height="30" viewBox="0 0 30 30">
            <line x1="15" y1="0" x2="15" y2="30" stroke="#4f46e5" strokeWidth="1" strokeDasharray="2,2" />
          </svg>
          {/* Small triangles */}
          <div className="absolute top-24 left-32 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-indigo-400"></div>
          <div className="absolute top-40 right-24 w-0 h-0 border-l-[5px] border-r-[5px] border-b-[8px] border-l-transparent border-r-transparent border-b-gray-400"></div>
          <div className="absolute top-60 left-20 w-0 h-0 border-l-[4px] border-r-[4px] border-b-[7px] border-l-transparent border-r-transparent border-b-indigo-300"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 px-8 pt-8 pb-4">
          {/* Header Text */}
          <p className="text-xs text-gray-600 text-center mb-2 font-light">
            We are inviting you to join the
          </p>

          {/* Event Title */}
          <h1 className="text-4xl font-bold text-indigo-800 text-center mb-2" style={{ letterSpacing: '-0.5px' }}>
            {eventName}
          </h1>
          <p className="text-sm text-gray-600 text-center mb-6 font-light">
            A Celebration of Excellence & Achievement
          </p>

          {/* Divider Line */}
          <div className="w-16 h-px bg-gray-300 mx-auto mb-6"></div>

          {/* Attendee Information */}
          <div className="mb-6">
            {profilePhoto ? (
              <div className="flex items-center justify-center mb-4">
                <img
                  ref={photoImageRef}
                  src={profilePhoto}
                  alt={fullName}
                  className="w-20 h-20 rounded-full object-cover border-2 border-indigo-200"
                  onLoad={() => {
                    setImagesLoaded(true);
                  }}
                  style={{
                    display: 'block',
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    visibility: 'visible',
                    opacity: 1
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center justify-center mb-4">
                <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-indigo-200">
                  <span className="text-2xl text-indigo-700 font-bold">{fullName.charAt(0).toUpperCase()}</span>
                </div>
              </div>
            )}
            <h2 className="text-xl font-semibold text-gray-800 text-center mb-1">{fullName}</h2>
            <p className="text-sm text-indigo-700 text-center mb-1">{designation}</p>
            {designation === 'Alumni' && passedOutYear && (
              <p className="text-xs text-gray-500 text-center">Batch of {passedOutYear}</p>
            )}
          </div>

          {/* Divider Line */}
          <div className="w-16 h-px bg-gray-300 mx-auto mb-6"></div>

          {/* Event Details */}
          <div className="mb-6 space-y-2 text-sm text-gray-700">
            <p className="text-center">
              <span className="font-semibold">Date:</span>{' '}
              {eventDateStart && eventDateEnd 
                ? `${eventDateStart} - ${eventDateEnd}` 
                : eventDate}
            </p>
            <p className="text-center">
              <span className="font-semibold">Venue:</span> {eventVenue}
            </p>
            {selectedDays && selectedDays.length > 0 && (
              <div className="mt-3">
                <p className="text-center text-xs font-semibold text-indigo-700 mb-2">
                  Selected Days:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {selectedDays.map((day, index) => {
                    const date = new Date(day);
                    const formattedDate = date.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      year: 'numeric'
                    });
                    return (
                      <span
                        key={index}
                        className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs font-medium"
                      >
                        {formattedDate}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            {eventDateStart && eventDateEnd && (
              <p className="text-center text-xs text-gray-500 mt-1">
                (One entry per day allowed)
              </p>
            )}
          </div>

          {/* QR Code Section */}
          <div className="mb-6 text-center">
            <p className="text-xs text-gray-500 mb-2">Present this QR code at the entrance</p>
            {/* <p className="text-xs text-indigo-600 font-semibold mb-3">✨ One QR code covers entire family ✨</p> */}
            <div
              ref={qrWrapperRef}
              style={{
                background: "#FFFFFF",
                padding: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: "1px solid #e5e7eb",
                borderRadius: "4px",
                width: "200px",
                margin: "0 auto",
              }}
            >
              <img
                ref={qrImageRef}
                src={qrCode}
                crossOrigin="anonymous"
                alt="QR Code"
                style={{ width: "180px", height: "180px" }}
                onLoad={() => {
                  setImagesLoaded(true);
                }}
                onError={(e) => {
                  setTimeout(() => {
                    if (e.target) {
                      e.target.src = '';
                      setTimeout(() => {
                        e.target.src = qrCode;
                      }, 100);
                    }
                  }, 200);
                }}
              />
            </div>
            <p className="text-xs text-indigo-600 font-mono mt-2 font-semibold">{attendeeCode}</p>
          </div>

          {/* Contact Information */}
          {(email || phone) && (
            <>
              <div className="w-16 h-px bg-gray-300 mx-auto mb-4"></div>
              <div className="mb-4 space-y-1 text-sm text-gray-700 text-center">
                {email && (
                  <p>
                    <span className="font-semibold">Email:</span> {email}
                  </p>
                )}
                {phone && (
                  <p>
                    <span className="font-semibold">Phone:</span> {phone}
                  </p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Abstract Wave Pattern at Bottom */}
        <div className="relative h-32 overflow-hidden">
          {/* Wave shapes */}
          <svg className="absolute bottom-0 left-0 w-full h-full" viewBox="0 0 550 128" preserveAspectRatio="none">
            {/* Purple wave */}
            <path
              d="M0,80 Q137.5,40 275,60 T550,50 L550,128 L0,128 Z"
              fill="#6366f1"
              opacity="0.9"
            />
            {/* Blue wave */}
            <path
              d="M0,100 Q137.5,60 275,80 T550,70 L550,128 L0,128 Z"
              fill="#3b82f6"
              opacity="0.8"
            />
            {/* Teal wave */}
            <path
              d="M0,110 Q137.5,70 275,90 T550,85 L550,128 L0,128 Z"
              fill="#14b8a6"
              opacity="0.7"
            />
            {/* Orange wave */}
            <path
              d="M0,115 Q137.5,75 275,95 T550,95 L550,128 L0,128 Z"
              fill="#f97316"
              opacity="0.6"
            />
            {/* Yellow accents */}
            <path
              d="M0,120 Q137.5,80 275,100 T550,100 L550,128 L0,128 Z"
              fill="#eab308"
              opacity="0.5"
            />
            {/* Dashed pattern overlay */}
            <defs>
              <pattern id="dashPattern" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
                <line x1="0" y1="2" x2="4" y2="2" stroke="#ffffff" strokeWidth="0.5" strokeDasharray="1,1" opacity="0.3" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="550" height="128" fill="url(#dashPattern)" />
          </svg>
          
          {/* Scattered triangles */}
          <div className="absolute bottom-8 left-12 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[12px] border-l-transparent border-r-transparent border-b-yellow-300"></div>
          <div className="absolute bottom-16 right-20 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[10px] border-l-transparent border-r-transparent border-b-orange-300"></div>
          <div className="absolute bottom-12 left-32 w-0 h-0 border-l-[5px] border-r-[5px] border-b-[8px] border-l-transparent border-r-transparent border-b-gray-300"></div>
          <div className="absolute bottom-20 right-40 w-0 h-0 border-l-[7px] border-r-[7px] border-b-[11px] border-l-transparent border-r-transparent border-b-teal-300"></div>
          
          {/* Powered By Notice */}
          <div className="absolute bottom-2 left-0 right-0 text-center">
            <p className="text-xs text-white opacity-95 font-semibold">
              Powered By : <a href="https://pinkmoontech.com/" target="_blank" rel="noopener noreferrer" className="underline hover:opacity-100 font-bold text-yellow-200 cursor-pointer" style={{ textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)' }}>PinkMoon Technologies Pvt Ltd</a>
            </p>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="mt-6 text-center">
        <button
          onClick={downloadCard}
          disabled={!imagesLoaded}
          className="bg-gradient-to-r from-indigo-700 to-indigo-800 text-white px-8 py-3 rounded-lg font-semibold hover:from-indigo-800 hover:to-indigo-900 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02]"
        >
          {imagesLoaded ? '📥 Download Invitation Card' : '⏳ Loading Images...'}
        </button>
        {/* <p className="text-xs text-gray-500 mt-2">
          Downloads as high-quality PNG image
        </p> */}
        {!imagesLoaded && (
          <p className="text-xs text-yellow-600 mt-1">
            Please wait for images to load...
          </p>
        )}
      </div>
    </div>
  );
};

export default InvitationCard;

