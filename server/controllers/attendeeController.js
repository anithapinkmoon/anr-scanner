import Attendee from '../models/Attendee.js';
import { generateAttendeeCode } from '../utils/generateAttendeeCode.js';
import { generateQRCode } from '../utils/qrGenerator.js';

// Helper function to generate placeholder email if not provided
const generatePlaceholderEmail = (attendeeCode) => {
  return `noemail-${attendeeCode.toLowerCase()}@event.local`;
};

// Helper: safely parse age coming from the client (string -> Int or null)
const parseAge = (value) => {
  if (value === undefined || value === null || value === '') return null;
  const num = parseInt(value, 10);
  return Number.isNaN(num) ? null : num;
};

// @desc    Register new attendee
// @route   POST /api/register
// @access  Public
export const registerAttendee = async (req, res) => {
  try {
    const { 
      fullName, 
      email, 
      phone, 
      designation, 
      passedOutYear, 
      profilePhoto,
      alternativeContact,
      address,
      registeredBy,
      registrationNotes,
      // Family/Group registration
      companions = [],
      isPrimary = true,
      primaryAttendeeId,
      age,
      relationship,
      // Multi-day event selection
      selectedDays = [],
      // Alumni specific fields
      intermediateYear,
      intermediateGroup,
      intermediateOther,
      degreeYear,
      degreeGroup,
      degreeOther,
      pgYear,
      pgCourse,
      nativePlace,
      residentialAddress,
      briefProfile
    } = req.body;

    // Validation - only fullName and designation are required
    if (!fullName || !designation) {
      return res.status(400).json({
        success: false,
        message: 'Full name and designation are required',
      });
    }

    // Alumni specific validation
    if (designation === 'Alumni') {
      if (!nativePlace || !residentialAddress || !briefProfile) {
        return res.status(400).json({
          success: false,
          message: 'For Alumni: Native Place, Residential Address, and Brief Profile are required',
        });
      }
      // Phone is already validated as a general field, but ensure it's provided for Alumni
      if (!phone) {
        return res.status(400).json({
          success: false,
          message: 'Mobile Number is required',
        });
      }
    }

    // Validate email format if provided
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Check if email already exists (only if email is provided)
    if (email) {
      const existingAttendee = await Attendee.findOne({ email });
      if (existingAttendee) {
        return res.status(400).json({
          success: false,
          message: 'Email already registered',
        });
      }
    }

    // Generate attendee code
    const attendeeCode = generateAttendeeCode(designation);

    // Generate placeholder email if not provided (for database consistency)
    const finalEmail = email || generatePlaceholderEmail(attendeeCode);

    // Generate QR code
    const qrCode = await generateQRCode(attendeeCode);

    // Determine total allowed entries for this QR (primary + companions)
    const totalEntries = 1 + (companions && isPrimary ? companions.length : 0);

    // Validate and format selectedDays (ensure it's an array of valid dates)
    let formattedSelectedDays = [];
    if (Array.isArray(selectedDays) && selectedDays.length > 0) {
      formattedSelectedDays = selectedDays
        .filter(day => day && typeof day === 'string')
        .map(day => {
          // Ensure date is in YYYY-MM-DD format
          const date = new Date(day);
          if (!isNaN(date.getTime())) {
            return date.toISOString().split('T')[0];
          }
          return null;
        })
        .filter(day => day !== null);
    }

    // Helper to parse year fields
    const parseYear = (value) => {
      if (!value || value === '') return null;
      const num = parseInt(value, 10);
      return Number.isNaN(num) ? null : num;
    };

    // Create primary attendee
    const attendeeData = {
      fullName,
      email: finalEmail,
      phone: phone || null,
      alternativeContact: alternativeContact || null,
      address: address || null,
      designation,
      passedOutYear: designation === 'Alumni' ? passedOutYear : undefined,
      profilePhoto: profilePhoto || null,
      attendeeCode,
      qrCode,
      isPrimary: isPrimary && !primaryAttendeeId,
      primaryAttendeeId: primaryAttendeeId || null,
      registeredBy: registeredBy || null,
      registrationNotes: registrationNotes || null,
      age: parseAge(age),
      relationship: relationship || null,
      maxEntries: totalEntries,
      usedEntries: 0,
      selectedDays: formattedSelectedDays.length > 0 ? formattedSelectedDays : null,
      // Alumni specific fields
      intermediateYear: parseYear(intermediateYear),
      intermediateGroup: intermediateGroup || null,
      intermediateOther: intermediateOther || null,
      degreeYear: parseYear(degreeYear),
      degreeGroup: degreeGroup || null,
      degreeOther: degreeOther || null,
      pgYear: parseYear(pgYear),
      pgCourse: pgCourse || null,
      nativePlace: nativePlace || null,
      residentialAddress: residentialAddress || null,
      briefProfile: briefProfile || null,
    };

    const attendee = await Attendee.create(attendeeData);

    // Handle companions/family members if provided
    const createdCompanions = [];
    if (companions && companions.length > 0 && isPrimary) {
      for (const companion of companions) {
        const companionCode = generateAttendeeCode(companion.designation || designation);
        const companionEmail = companion.email || generatePlaceholderEmail(companionCode);
        const companionQR = await generateQRCode(companionCode);

        const companionData = {
          fullName: companion.fullName,
          email: companionEmail,
          phone: companion.phone || null,
          alternativeContact: companion.alternativeContact || null,
          address: companion.address || null,
          designation: companion.designation || designation,
          passedOutYear:
            companion.designation === 'Alumni' && companion.passedOutYear
              ? companion.passedOutYear
              : undefined,
          profilePhoto: companion.profilePhoto || null,
          attendeeCode: companionCode,
          qrCode: companionQR,
          isPrimary: false,
          primaryAttendeeId: attendee.id,
          registeredBy: registeredBy || null,
          registrationNotes: companion.registrationNotes || null,
          age: parseAge(companion.age),
          relationship: companion.relationship || null,
          // Companions inherit the same selected days as primary
          selectedDays: formattedSelectedDays.length > 0 ? formattedSelectedDays : null,
        };

        const createdCompanion = await Attendee.create(companionData);
        createdCompanions.push({
          attendeeCode: createdCompanion.attendeeCode,
          qrCode: createdCompanion.qrCode,
          fullName: createdCompanion.fullName,
          designation: createdCompanion.designation,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: companions && companions.length > 0 
        ? 'Registration successful with companions' 
        : 'Registration successful',
      data: {
        attendeeCode: attendee.attendeeCode,
        qrCode: attendee.qrCode,
        fullName: attendee.fullName,
        email: email || null, // Return null if placeholder was used
        phone: attendee.phone,
        designation: attendee.designation,
        companions: createdCompanions.length > 0 ? createdCompanions : undefined,
        selectedDays: formattedSelectedDays.length > 0 ? formattedSelectedDays : undefined,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: error.message,
    });
  }
};

// @desc    Verify QR code
// @route   GET /api/verify
// @access  Public
export const verifyQRCode = async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).json({
        success: false,
        status: 'invalid',
        message: 'QR code is required',
      });
    }

    const attendee = await Attendee.findOne({ attendeeCode: code });

    if (!attendee) {
      return res.status(404).json({
        success: false,
        status: 'invalid',
        message: 'Invalid QR code',
      });
    }

    // Always count entries against the primary attendee's QR
    let primaryAttendee = attendee;
    if (!attendee.isPrimary && attendee.primaryAttendeeId) {
      primaryAttendee = await Attendee.findById(attendee.primaryAttendeeId);
      if (!primaryAttendee) {
        return res.status(404).json({
          success: false,
          status: 'invalid',
          message: 'Primary attendee not found for this QR',
        });
      }
    }

    const maxEntries = primaryAttendee.maxEntries || 1;
    const usedEntries = primaryAttendee.usedEntries || 0;

    // Check daily entry tracking (one entry per day for multi-day events)
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const entryDays = primaryAttendee.entryDays || [];
    const hasEnteredToday = Array.isArray(entryDays) && entryDays.includes(today);

    // Check if attendee selected this day for attendance
    const selectedDays = primaryAttendee.selectedDays || [];
    const isDaySelected = Array.isArray(selectedDays) && selectedDays.length > 0 
      ? selectedDays.includes(today)
      : true; // If no days selected, allow entry (backward compatibility)

    // If day is not selected, reject entry
    if (!isDaySelected) {
      return res.status(200).json({
        success: false,
        status: 'invalid',
        message: `Entry not allowed for today (${today}). You are registered for other days only.`,
        data: {
          attendeeCode: primaryAttendee.attendeeCode,
          fullName: primaryAttendee.fullName,
          selectedDays: selectedDays,
          today: today,
          allowedDays: selectedDays,
        },
      });
    }

    // If already entered today, reject
    if (hasEnteredToday) {
      return res.status(200).json({
        success: false,
        status: 'duplicate',
        message: `Already entered today (${today}). One entry per day allowed.`,
        data: {
          attendeeCode: primaryAttendee.attendeeCode,
          fullName: primaryAttendee.fullName,
          entryDays: entryDays,
          today: today,
        },
      });
    }

    // If limit reached, do not allow more people
    if (usedEntries >= maxEntries) {
      // Ensure all family members are marked as scanned for reporting
      const companionsAtLimit = await Attendee.find({ primaryAttendeeId: primaryAttendee.id });
      for (const member of [primaryAttendee, ...companionsAtLimit]) {
        if (!member.isScanned) {
          await Attendee.update(member.id, {
            isScanned: true,
            entryTime: member.entryTime || new Date(),
          });
        }
      }

      const updatedPrimaryAtLimit = await Attendee.findById(primaryAttendee.id);

      return res.status(200).json({
        success: false,
        status: 'duplicate',
        message: 'All registered members already entered with this QR',
        data: {
          attendeeCode: updatedPrimaryAtLimit.attendeeCode,
          fullName: updatedPrimaryAtLimit.fullName,
          maxEntries,
          usedEntries,
          remainingEntries: 0,
          entryDays: updatedPrimaryAtLimit.entryDays || [],
          today: today,
        },
      });
    }

    // One scan = one person entering
    const newUsedEntries = usedEntries + 1;
    const entryTime = new Date();

    // Add today's date to entryDays array
    const updatedEntryDays = Array.isArray(entryDays) ? [...entryDays, today] : [today];

    // Find family members (primary + companions)
    const companions = await Attendee.find({ primaryAttendeeId: primaryAttendee.id });
    const familyMembers = [primaryAttendee, ...companions];

    // Pick the next not-scanned member (so DB shows how many individuals have entered)
    const nextMemberToMark = familyMembers.find((m) => !m.isScanned) || primaryAttendee;

    // Mark that member as scanned
    await Attendee.update(nextMemberToMark.id, {
      isScanned: true,
      entryTime,
    });

    // Update primary's counter and entryDays
    await Attendee.update(primaryAttendee.id, {
      usedEntries: newUsedEntries,
      entryDays: updatedEntryDays,
      // Also keep primary marked as scanned once anyone from this QR has entered
      isScanned: true,
      entryTime: nextMemberToMark.id === primaryAttendee.id ? entryTime : primaryAttendee.entryTime || entryTime,
    });

    // Reload fresh data for response
    const updatedPrimary = await Attendee.findById(primaryAttendee.id);
    const updatedCompanions = await Attendee.find({ primaryAttendeeId: primaryAttendee.id });

    // Build family list with scan status
    const updatedFamily = [
      {
        attendeeCode: updatedPrimary.attendeeCode,
        fullName: updatedPrimary.fullName,
        designation: updatedPrimary.designation,
        relationship: 'Primary',
        isScanned: updatedPrimary.isScanned,
        entryTime: updatedPrimary.entryTime,
      },
      ...updatedCompanions.map((c) => ({
        attendeeCode: c.attendeeCode,
        fullName: c.fullName,
        designation: c.designation,
        relationship: c.relationship || 'Companion',
        isScanned: c.isScanned,
        entryTime: c.entryTime,
      })),
    ];

    return res.status(200).json({
      success: true,
      status: 'success',
      message:
        newUsedEntries >= maxEntries
          ? 'Entry verified. All registered members have now entered.'
          : 'Entry verified. More members can still enter with this QR.',
      data: {
        attendeeCode: updatedPrimary.attendeeCode,
        fullName: updatedPrimary.fullName,
        email: updatedPrimary.email,
        phone: updatedPrimary.phone,
        designation: updatedPrimary.designation,
        entryTime: updatedPrimary.entryTime,
        maxEntries,
        usedEntries: newUsedEntries,
        remainingEntries: Math.max(maxEntries - newUsedEntries, 0),
        entryDays: updatedPrimary.entryDays || [],
        selectedDays: updatedPrimary.selectedDays || [],
        today: today,
        familyMembers: updatedFamily,
      },
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({
      success: false,
      status: 'error',
      message: 'Server error during verification',
      error: error.message,
    });
  }
};

