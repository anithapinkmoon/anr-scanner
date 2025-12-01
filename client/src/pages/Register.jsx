import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../utils/api';
import InvitationCard from '../components/InvitationCard';
import collegeLogo from '../assets/diamond.jpg';
import collegeBannerLogo from '../assets/anr-college-logo.jpg';

const Register = () => {
  const navigate = useNavigate();
  // Event dates - dynamically calculated from today
  const getEventDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateString = date.toISOString().split('T')[0]; // YYYY-MM-DD format
      const formattedDate = date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      
      dates.push({
        date: dateString,
        label: `Day ${i + 1} - ${formattedDate}`
      });
    }
    
    return dates;
  };

  const eventDates = getEventDates();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    alternativeContact: '',
    address: '',
    designation: '',
    passedOutYear: '',
    profilePhoto: '',
    registeredBy: '',
    registrationNotes: '',
    hasCompanions: false,
    companions: [],
    selectedDays: [], // Array of selected day dates
    // Alumni specific fields
    intermediateYear: '',
    intermediateGroup: '',
    intermediateOther: '',
    degreeYear: '',
    degreeGroup: '',
    degreeOther: '',
    pgYear: '',
    pgCourse: '',
    nativePlace: '',
    residentialAddress: '',
    briefProfile: '',
  });
  const [loading, setLoading] = useState(false);
  const [registrationData, setRegistrationData] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          profilePhoto: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate selected days
      if (!formData.selectedDays || formData.selectedDays.length === 0) {
        toast.error('Please select at least one day to attend');
        setLoading(false);
        return;
      }

      if (formData.hasCompanions) {
        const invalidCompanions = formData.companions.filter(
          (c) => !c.fullName || c.fullName.trim() === ''
        );
        if (invalidCompanions.length > 0) {
          toast.error('Please provide names for all companions');
          setLoading(false);
          return;
        }
      }

      // Validate Alumni required fields
      if (formData.designation === 'Alumni') {
        if (!formData.nativePlace || !formData.residentialAddress || !formData.briefProfile) {
          toast.error('For Alumni: Native Place, Residential Address, and Brief Profile are required');
          setLoading(false);
          return;
        }
        // Phone is already validated in the general form above
        if (!formData.phone) {
          toast.error('Mobile Number is required');
          setLoading(false);
          return;
        }
      }

      const payload = {
        ...formData,
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        alternativeContact: formData.alternativeContact.trim() || null,
        address: formData.address.trim() || null,
        passedOutYear: formData.passedOutYear ? parseInt(formData.passedOutYear, 10) : null,
        companions: formData.hasCompanions ? formData.companions : [],
        // Alumni specific fields - parse years to integers
        intermediateYear: formData.intermediateYear ? parseInt(formData.intermediateYear, 10) : null,
        degreeYear: formData.degreeYear ? parseInt(formData.degreeYear, 10) : null,
        pgYear: formData.pgYear ? parseInt(formData.pgYear, 10) : null,
      };

      const response = await api.post('/register', payload);
      setRegistrationData({
        ...response.data.data,
        email: formData.email || null,
        phone: formData.phone || null,
        passedOutYear: formData.passedOutYear || null,
        profilePhoto: formData.profilePhoto || null,
        companions: response.data.data.companions || [],
        selectedDays: response.data.data.selectedDays || formData.selectedDays || [],
      });
      toast.success(
        formData.hasCompanions && formData.companions.length > 0
          ? `Registration successful! Registered ${formData.companions.length + 1} people.`
          : 'Registration successful!'
      );
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (registrationData) {
    return (
      <div className="min-h-screen bg-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-indigo-900 mb-2">
              Registration Successful!
            </h2>
            <p className="text-indigo-600">Your invitation card is ready to download</p>
          </div>

          {/* Family Members Info Banner */}
          {registrationData.companions && registrationData.companions.length > 0 && (
            <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-4 rounded-xl mb-6 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-indigo-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-lg mb-1">
                    Family Registration Complete
                  </p>
                  <p className="text-indigo-100 text-sm">
                    {registrationData.companions.length + 1} family members registered. One QR code covers everyone!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Invitation Card */}
          <div className="mb-8 flex justify-center">
            <InvitationCard
              qrCode={registrationData.qrCode}
              attendeeCode={registrationData.attendeeCode}
              fullName={registrationData.fullName}
              email={registrationData.email}
              phone={registrationData.phone}
              designation={registrationData.designation}
              passedOutYear={registrationData.passedOutYear}
              profilePhoto={registrationData.profilePhoto}
              eventDateStart={eventDates[0] ? new Date(eventDates[0].date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
              eventDateEnd={eventDates[2] ? new Date(eventDates[2].date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}
              selectedDays={registrationData.selectedDays || []}
            />
          </div>

          {/* Family Members List */}
          {registrationData.companions && registrationData.companions.length > 0 && (
            <div className="mb-8 bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
              <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Registered Family Members ({registrationData.companions.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {registrationData.companions.map((companion, index) => (
                  <div key={index} className="bg-indigo-50 p-4 rounded-lg border border-indigo-200 hover:shadow-md transition-shadow">
                    <p className="font-semibold text-indigo-900 mb-1">{companion.fullName}</p>
                    <div className="flex items-center gap-2 text-sm text-indigo-700">
                      <span className="bg-indigo-200 px-2 py-1 rounded text-xs font-medium">{companion.designation}</span>
                      <span className="text-indigo-600 font-mono text-xs">Code: {companion.attendeeCode}</span>
                    </div>
                    {companion.relationship && (
                      <p className="text-xs text-indigo-600 mt-1">Relationship: {companion.relationship}</p>
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">Note:</span> All family members will enter together when the primary QR code is scanned at the gate.
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            <button
              onClick={() => {
                setRegistrationData(null);
                setFormData({
                  fullName: '',
                  email: '',
                  phone: '',
                  alternativeContact: '',
                  address: '',
                  designation: '',
                  passedOutYear: '',
                  profilePhoto: '',
                  registeredBy: '',
                  registrationNotes: '',
                  hasCompanions: false,
                  companions: [],
                  selectedDays: [],
                });
              }}
              className="bg-gradient-to-r from-indigo-700 to-indigo-800 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:from-indigo-800 hover:to-indigo-900 transition-all transform hover:scale-[1.02]"
            >
              Register Another Person
            </button>
            <div>
              <button
                onClick={() => navigate('/')}
                className="text-indigo-700 hover:text-indigo-800 font-medium text-sm"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Icon components
  const UserIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );

  const EmailIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const PhoneIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );

  const LocationIcon = () => (
    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-indigo-50 flex items-center justify-center py-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
          {/* Left Section - Information */}
          <div className="bg-gradient-to-br from-indigo-700 via-indigo-800 to-indigo-900 text-white p-8 lg:p-12 flex flex-col justify-center lg:w-1/2 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 rounded-full blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
            
            <div className="relative z-10">
              {/* <div className="mb-8">
                <img 
                  src={collegeBannerLogo} 
                  alt="ANR College Banner" 
                  className="w-full h-auto object-contain rounded-lg shadow-lg"
                />
              </div> */}
              
              {/* Logo and College Name */}
              <div className="mb-10">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-2xl p-3 transform hover:scale-105 transition-transform duration-300">
                    <img 
                      src={collegeLogo} 
                      alt="ANR College Logo" 
                      className="w-full h-full object-contain rounded-full"
                    />
                  </div>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-center mb-3 uppercase tracking-wide leading-tight">
                  Akkineni Nageswara Rao College
                </h1>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="h-px bg-indigo-300 flex-1 max-w-20"></div>
                  <p className="text-center text-indigo-200 text-sm font-medium px-2">
                    (with Post - Graduate Courses)
                  </p>
                  <div className="h-px bg-indigo-300 flex-1 max-w-20"></div>
                </div>
                <div className="space-y-1">
                  <p className="text-center text-indigo-200 text-xs font-medium">
                    Autonomous & Affiliated to Krishna University
                  </p>
                  <p className="text-center text-indigo-200 text-xs font-medium">
                    Reaccredited by NAAC with 'A' Grade
                  </p>
                </div>
              </div>

              {/* Event Name */}
              <div className="mb-10 text-center">
                <div className="inline-block mb-4">
                  <span className="text-6xl lg:text-7xl font-bold mb-2 block leading-none bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 bg-clip-text text-transparent drop-shadow-lg">
                    75
                  </span>
                </div>
                <h2 className="text-3xl lg:text-4xl font-bold mb-3 uppercase tracking-wider leading-tight">
                  Diamond Jubilee
                </h2>
                <div className="flex items-center justify-center gap-2 mb-3">
                  <div className="h-px bg-yellow-400 flex-1 max-w-16"></div>
                  <p className="text-xl text-yellow-200 font-semibold px-2">
                    Event Registration
                  </p>
                  <div className="h-px bg-yellow-400 flex-1 max-w-16"></div>
                </div>
                <p className="text-indigo-200 text-sm font-medium">
                  Celebrating 75 Years of Excellence
                </p>
              </div>

              {/* Information Cards */}
              {/* <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-indigo-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Quick Registration</h3>
                      <p className="text-indigo-100 text-sm leading-relaxed">
                        Fill out the form on the right. Fields marked with (*) are required.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-indigo-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Family Registration</h3>
                      <p className="text-indigo-100 text-sm leading-relaxed">
                        Register your family members together. One QR code covers everyone!
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5 border border-white/20 shadow-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-indigo-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">Digital Invitation</h3>
                      <p className="text-indigo-100 text-sm leading-relaxed">
                        Receive your unique QR code invitation card. Download and keep it safe for event entry.
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}
            </div>
          </div>

          {/* Right Section - Registration Form */}
          <div className="bg-white p-8 lg:p-12 lg:w-1/2">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name *"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                />
              </div>

              {/* Phone */}
              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required={formData.designation === 'Alumni'}
                  placeholder={formData.designation === 'Alumni' ? 'Enter your mobile number *' : 'Enter your phone number'}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                />
              </div>

              {/* Alternative Contact */}
              <div>
                <input
                  type="text"
                  name="alternativeContact"
                  value={formData.alternativeContact}
                  onChange={handleChange}
                  placeholder="Enter alternative contact"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none"
                />
              </div>

              {/* Address */}
              <div>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Enter your complete address"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none resize-none"
                />
              </div>

              {/* Designation */}
              <div className="relative">
                <select
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none appearance-none cursor-pointer"
                >
                  <option value="" className="text-gray-400">Select your designation *</option>
                  <option value="Student">Student</option>
                  <option value="Alumni">Alumni</option>
                  <option value="Staff">Staff</option>
                  <option value="Guest">Guest</option>
                  <option value="VIP">VIP</option>
                </select>
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Alumni Specific Fields */}
              {formData.designation === 'Alumni' && (
                <div className="space-y-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-indigo-900 mb-4">Alumni Information</h3>
                  
                  {/* Intermediate/PUC Section */}
                  <div className="space-y-3 border-b border-blue-200 pb-4">
                    <h4 className="text-sm font-semibold text-indigo-800">Intermediate / PUC (Optional)</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Year of Admission</label>
                        <input
                          type="number"
                          name="intermediateYear"
                          value={formData.intermediateYear}
                          onChange={handleChange}
                          placeholder="e.g., 2010"
                          min="1950"
                          max={new Date().getFullYear()}
                          className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Intermediate Group</label>
                        <select
                          name="intermediateGroup"
                          value={formData.intermediateGroup}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select Group</option>
                          <option value="M.P.C.">M.P.C.</option>
                          <option value="Bi.P.C.">Bi.P.C.</option>
                          <option value="C.E.C.">C.E.C.</option>
                          <option value="H.E.C.">H.E.C.</option>
                          <option value="M.E.C.">M.E.C.</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    {formData.intermediateGroup === 'Other' && (
                      <div>
                        <input
                          type="text"
                          name="intermediateOther"
                          value={formData.intermediateOther}
                          onChange={handleChange}
                          placeholder="Specify other group"
                          className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    )}
                  </div>

                  {/* Degree Section */}
                  <div className="space-y-3 border-b border-blue-200 pb-4">
                    <h4 className="text-sm font-semibold text-indigo-800">Degree (Optional)</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Year of Admission</label>
                        <input
                          type="number"
                          name="degreeYear"
                          value={formData.degreeYear}
                          onChange={handleChange}
                          placeholder="e.g., 2012"
                          min="1950"
                          max={new Date().getFullYear()}
                          className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Degree Group</label>
                        <select
                          name="degreeGroup"
                          value={formData.degreeGroup}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select Degree</option>
                          <option value="B.Sc. M.P.C.">B.Sc. M.P.C.</option>
                          <option value="B.Sc. C.B.Z.">B.Sc. C.B.Z.</option>
                          <option value="B.A.">B.A.</option>
                          <option value="B.Com.">B.Com.</option>
                          <option value="B.Com. Computers">B.Com. Computers</option>
                          <option value="B.Sc. MPCS">B.Sc. MPCS</option>
                          <option value="B.Sc. MSCS">B.Sc. MSCS</option>
                          <option value="B.Sc. MPE">B.Sc. MPE</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    {formData.degreeGroup === 'Other' && (
                      <div>
                        <input
                          type="text"
                          name="degreeOther"
                          value={formData.degreeOther}
                          onChange={handleChange}
                          placeholder="Specify other degree"
                          className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    )}
                  </div>

                  {/* P.G. Section */}
                  <div className="space-y-3 border-b border-blue-200 pb-4">
                    <h4 className="text-sm font-semibold text-indigo-800">P.G. (Optional)</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Year of Admission</label>
                        <input
                          type="number"
                          name="pgYear"
                          value={formData.pgYear}
                          onChange={handleChange}
                          placeholder="e.g., 2014"
                          min="1950"
                          max={new Date().getFullYear()}
                          className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">P.G. Course</label>
                        <select
                          name="pgCourse"
                          value={formData.pgCourse}
                          onChange={handleChange}
                          className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="">Select P.G. Course</option>
                          <option value="M.Com.">M.Com.</option>
                          <option value="M.B.A.">M.B.A.</option>
                          <option value="M.C.A.">M.C.A.</option>
                          <option value="M.Sc. Mathematics">M.Sc. Mathematics</option>
                          <option value="M.Sc. Physics">M.Sc. Physics</option>
                          <option value="M.Sc. Chemistry">M.Sc. Chemistry</option>
                          <option value="M.Sc. Computer Science">M.Sc. Computer Science</option>
                          <option value="M.Sc. Botany">M.Sc. Botany</option>
                          <option value="M.Sc. Microbiology">M.Sc. Microbiology</option>
                          <option value="M.Sc. I.S.">M.Sc. I.S.</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Required Fields */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Native Place <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        name="nativePlace"
                        value={formData.nativePlace}
                        onChange={handleChange}
                        required
                        placeholder="Enter your native place"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Residential Address <span className="text-red-500">*</span></label>
                      <textarea
                        name="residentialAddress"
                        value={formData.residentialAddress}
                        onChange={handleChange}
                        required
                        rows={2}
                        placeholder="Enter your complete residential address"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">Brief Profile (Past and Present Occupation / Profession) with achievements <span className="text-red-500">*</span></label>
                      <textarea
                        name="briefProfile"
                        value={formData.briefProfile}
                        onChange={handleChange}
                        required
                        rows={4}
                        placeholder="Describe your past and present occupation/profession and achievements"
                        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Event Days Selection */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                <label className="block text-sm font-semibold text-indigo-900 mb-3">
                  Select Days to Attend <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-indigo-700 mb-3">
                  Please select which days you will be attending the event
                </p>
                <div className="space-y-2">
                  {eventDates.map((eventDay) => (
                    <label
                      key={eventDay.date}
                      className="flex items-center p-3 bg-white rounded-lg border border-indigo-200 hover:border-indigo-400 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.selectedDays.includes(eventDay.date)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              selectedDays: [...formData.selectedDays, eventDay.date],
                            });
                          } else {
                            setFormData({
                              ...formData,
                              selectedDays: formData.selectedDays.filter((day) => day !== eventDay.date),
                            });
                          }
                        }}
                        className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 focus:ring-2"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">{eventDay.label}</span>
                    </label>
                  ))}
                </div>
                {formData.selectedDays.length === 0 && (
                  <p className="text-xs text-red-600 mt-2">Please select at least one day</p>
                )}
              </div>

              {/* Profile Photo */}
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 file:cursor-pointer cursor-pointer text-gray-600"
                />
              </div>

              {/* Family/Companions Registration */}
              <div className="border-t pt-4">
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    id="hasCompanions"
                    checked={formData.hasCompanions}
                    onChange={(e) => {
                      setFormData({
                        ...formData,
                        hasCompanions: e.target.checked,
                        companions: e.target.checked ? [{ fullName: '', designation: '', age: '', relationship: '' }] : [],
                      });
                    }}
                    className="mr-2 w-4 h-4 text-indigo-700 border-gray-300 rounded focus:ring-indigo-700"
                  />
                  <label htmlFor="hasCompanions" className="text-sm font-medium text-gray-700">
                    Registering with family members or companions?
                  </label>
                </div>

                {formData.hasCompanions && (
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-3">
                      Add family members, children, or companions who will attend with you:
                    </p>
                    {formData.companions.map((companion, index) => (
                      <div key={index} className="bg-white p-4 rounded border border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-medium text-gray-700">Companion {index + 1}</h4>
                          {formData.companions.length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const newCompanions = formData.companions.filter((_, i) => i !== index);
                                setFormData({ ...formData, companions: newCompanions });
                              }}
                              className="text-red-500 text-sm hover:text-red-700 font-medium"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Name *</label>
                            <input
                              type="text"
                              value={companion.fullName}
                              onChange={(e) => {
                                const newCompanions = [...formData.companions];
                                newCompanions[index].fullName = e.target.value;
                                setFormData({ ...formData, companions: newCompanions });
                              }}
                              required={formData.hasCompanions}
                              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-700"
                              placeholder="Full name"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Relationship</label>
                            <select
                              value={companion.relationship || ''}
                              onChange={(e) => {
                                const newCompanions = [...formData.companions];
                                newCompanions[index].relationship = e.target.value;
                                setFormData({ ...formData, companions: newCompanions });
                              }}
                              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-700"
                            >
                              <option value="">Select</option>
                              <option value="Spouse">Spouse</option>
                              <option value="Child">Child</option>
                              <option value="Parent">Parent</option>
                              <option value="Sibling">Sibling</option>
                              <option value="Friend">Friend</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Age</label>
                            <input
                              type="number"
                              value={companion.age || ''}
                              onChange={(e) => {
                                const newCompanions = [...formData.companions];
                                newCompanions[index].age = e.target.value;
                                setFormData({ ...formData, companions: newCompanions });
                              }}
                              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-700"
                              placeholder="Age"
                              min="0"
                              max="120"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-gray-600 mb-1">Designation</label>
                            <select
                              value={companion.designation || ''}
                              onChange={(e) => {
                                const newCompanions = [...formData.companions];
                                newCompanions[index].designation = e.target.value;
                                setFormData({ ...formData, companions: newCompanions });
                              }}
                              className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-700"
                            >
                              <option value="">Same as primary</option>
                              <option value="Guest">Guest</option>
                              <option value="Student">Student</option>
                              <option value="Alumni">Alumni</option>
                              <option value="Staff">Staff</option>
                              <option value="VIP">VIP</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          companions: [
                            ...formData.companions,
                            { fullName: '', designation: '', age: '', relationship: '' },
                          ],
                        });
                      }}
                      className="text-indigo-700 text-sm hover:text-indigo-800 font-medium"
                    >
                      + Add Another Companion
                    </button>
                  </div>
                )}
              </div>

              {/* Registration Notes */}
              <div>
                <textarea
                  name="registrationNotes"
                  value={formData.registrationNotes}
                  onChange={handleChange}
                  rows={2}
                  placeholder="Enter any special notes or additional information"
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:border-indigo-600 focus:outline-none resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-700 to-indigo-800 text-white py-4 px-6 rounded-lg font-semibold hover:from-indigo-800 hover:to-indigo-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-[1.02]"
              >
                {loading ? 'Registering...' : formData.hasCompanions ? 'Register All' : 'Register'}
              </button>

              {/* Sign In Link */}
              {/* <div className="text-center mt-4">
                <p className="text-gray-600 text-sm">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/admin/login')}
                    className="text-blue-600 font-semibold hover:text-blue-800 transition-colors"
                  >
                    Sign In
                  </button>
                </p>
              </div> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
