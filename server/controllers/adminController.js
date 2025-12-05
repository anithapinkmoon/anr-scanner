import jwt from 'jsonwebtoken';
import Attendee from '../models/Attendee.js';
import Admin from '../models/Admin.js';
import { config } from '../config.js';
import { createObjectCsvWriter } from 'csv-writer';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import prisma from '../database/prisma.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRE,
  });
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      });
    }

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const isPasswordMatched = await Admin.comparePassword(admin, password);

    if (!isPasswordMatched) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    const token = generateToken(admin.id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin.id,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: error.message,
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats
// @access  Private
export const getStats = async (req, res) => {
  try {
    const totalRegistrations = await Attendee.countDocuments();
    const totalScanned = await Attendee.countDocuments({ isScanned: true });
    const totalPending = totalRegistrations - totalScanned;

    // Category-wise stats using Prisma
    const categoryStats = await Attendee.aggregate([
      {
        $group: {
          _id: '$designation',
          total: { $sum: 1 },
          scanned: {
            $sum: { $cond: [{ $eq: ['$isScanned', true] }, 1, 0] },
          },
          pending: {
            $sum: { $cond: [{ $eq: ['$isScanned', false] }, 1, 0] },
          },
        },
      },
    ]);

    const categoryStatsMap = {};
    categoryStats.forEach((stat) => {
      categoryStatsMap[stat._id] = {
        total: stat.total,
        scanned: stat.scanned,
        pending: stat.pending,
      };
    });

    res.status(200).json({
      success: true,
      data: {
        totalRegistrations,
        totalScanned,
        totalPending,
        categoryStats: categoryStatsMap,
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching statistics',
      error: error.message,
    });
  }
};

// @desc    Get all attendees with filters
// @route   GET /api/admin/attendees
// @access  Private
export const getAttendees = async (req, res) => {
  try {
    const { search, designation, page = 1, limit = 50 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { attendeeCode: { $regex: search, $options: 'i' } },
      ];
    }

    if (designation) {
      query.designation = designation;
    }

    // Only get primary attendees (not companions) by default
    query.isPrimary = true;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const attendees = await Attendee.find({
      ...query,
      skip,
      limit: parseInt(limit),
      select: '-qrCode',
    });

    const total = await Attendee.countDocuments(query);

    // Fetch companions for all primary attendees
    const primaryIds = attendees.map(a => a.id);
    
    let companionsMap = {};
    if (primaryIds.length > 0) {
      const allCompanions = await prisma.attendee.findMany({
        where: {
          primaryAttendeeId: { in: primaryIds },
          isPrimary: false,
        },
        select: {
          id: true,
          fullName: true,
          attendeeCode: true,
          designation: true,
          relationship: true,
          age: true,
          email: true,
          phone: true,
          profilePhoto: true,
          passedOutYear: true,
          createdAt: true,
        },
      });

      // Group companions by primaryAttendeeId
      allCompanions.forEach(companion => {
        const primaryId = companion.primaryAttendeeId;
        if (!companionsMap[primaryId]) {
          companionsMap[primaryId] = [];
        }
        companionsMap[primaryId].push(companion);
      });
    }

    // Attach companions to each primary attendee
    const attendeesWithCompanions = attendees.map(attendee => ({
      ...attendee,
      companions: companionsMap[attendee.id] || undefined,
    }));

    res.status(200).json({
      success: true,
      data: {
        attendees: attendeesWithCompanions,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit)),
        },
      },
    });
  } catch (error) {
    console.error('Get attendees error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching attendees',
      error: error.message,
    });
  }
};

// @desc    Export attendees to CSV
// @route   GET /api/admin/export/csv
// @access  Private
export const exportCSV = async (req, res) => {
  try {
    const attendees = await Attendee.find({});

    const csvWriter = createObjectCsvWriter({
      path: 'attendees_export.csv',
      header: [
        { id: 'attendeeCode', title: 'Attendee Code' },
        { id: 'fullName', title: 'Full Name' },
        { id: 'email', title: 'Email' },
        { id: 'phone', title: 'Phone' },
        { id: 'designation', title: 'Designation' },
        { id: 'passedOutYear', title: 'Passed Out Year' },
        { id: 'isScanned', title: 'Scanned' },
        { id: 'entryTime', title: 'Entry Time' },
        { id: 'createdAt', title: 'Registration Date' },
      ],
    });

    const records = attendees.map((attendee) => ({
      attendeeCode: attendee.attendeeCode,
      fullName: attendee.fullName,
      email: attendee.email,
      phone: attendee.phone,
      designation: attendee.designation,
      passedOutYear: attendee.passedOutYear || 'N/A',
      isScanned: attendee.isScanned ? 'Yes' : 'No',
      entryTime: attendee.entryTime ? new Date(attendee.entryTime).toISOString() : 'N/A',
      createdAt: new Date(attendee.createdAt).toISOString(),
    }));

    await csvWriter.writeRecords(records);

    res.download('attendees_export.csv', 'attendees_export.csv', (err) => {
      if (err) {
        console.error('Download error:', err);
        res.status(500).json({
          success: false,
          message: 'Error downloading CSV file',
        });
      } else {
        // Clean up file after download
        setTimeout(() => {
          if (fs.existsSync('attendees_export.csv')) {
            fs.unlinkSync('attendees_export.csv');
          }
        }, 1000);
      }
    });
  } catch (error) {
    console.error('CSV export error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error exporting CSV',
      error: error.message,
    });
  }
};

// @desc    Export attendees to PDF
// @route   GET /api/admin/export/pdf
// @access  Private
export const exportPDF = async (req, res) => {
  try {
    const attendees = await Attendee.find({});

    const doc = new PDFDocument({ margin: 50 });
    const filename = 'attendees_export.pdf';

    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    // Title
    doc.fontSize(20).text('Golden Jubilee Event - Attendees Report', { align: 'center' });
    doc.moveDown();

    // Summary
    const total = attendees.length;
    const scanned = attendees.filter((a) => a.isScanned).length;
    const pending = total - scanned;

    doc.fontSize(12).text(`Total Registrations: ${total}`, { align: 'left' });
    doc.text(`Scanned: ${scanned}`, { align: 'left' });
    doc.text(`Pending: ${pending}`, { align: 'left' });
    doc.moveDown();

    // Table header
    let y = doc.y;
    doc.fontSize(10).font('Helvetica-Bold');
    doc.text('Code', 50, y);
    doc.text('Name', 120, y);
    doc.text('Email', 250, y);
    doc.text('Phone', 380, y);
    doc.text('Designation', 450, y);
    doc.text('Status', 520, y);

    y += 20;
    doc.moveTo(50, y).lineTo(550, y).stroke();
    y += 10;

    // Table rows
    doc.font('Helvetica');
    attendees.forEach((attendee, index) => {
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      doc.fontSize(8);
      doc.text(attendee.attendeeCode.substring(0, 12), 50, y);
      doc.text(attendee.fullName.substring(0, 15), 120, y);
      doc.text(attendee.email.substring(0, 18), 250, y);
      doc.text(attendee.phone.substring(0, 12), 380, y);
      doc.text(attendee.designation, 450, y);
      doc.text(attendee.isScanned ? 'Scanned' : 'Pending', 520, y);

      y += 15;
    });

    doc.end();
  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error exporting PDF',
      error: error.message,
    });
  }
};

// @desc    Get single attendee details
// @route   GET /api/admin/attendees/:id
// @access  Private
export const getAttendeeById = async (req, res) => {
  try {
    const { id } = req.params;

    const attendee = await Attendee.findById(id);

    if (!attendee) {
      return res.status(404).json({
        success: false,
        message: 'Attendee not found',
      });
    }

    // If it's a primary attendee, fetch companions
    let companions = undefined;
    if (attendee.isPrimary === true) {
      companions = await prisma.attendee.findMany({
        where: {
          primaryAttendeeId: parseInt(id),
          isPrimary: false,
        },
        select: {
          id: true,
          fullName: true,
          attendeeCode: true,
          designation: true,
          relationship: true,
          age: true,
          email: true,
          phone: true,
          profilePhoto: true,
          passedOutYear: true,
          createdAt: true,
        },
        orderBy: {
          createdAt: 'asc',
        },
      });
    }

    res.status(200).json({
      success: true,
      data: {
        ...attendee,
        companions: companions && companions.length > 0 ? companions : undefined,
      },
    });
  } catch (error) {
    console.error('Get attendee error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching attendee',
      error: error.message,
    });
  }
};

// @desc    Manually mark entry
// @route   PATCH /api/admin/attendees/:id/mark-entry
// @access  Private
export const markEntry = async (req, res) => {
  try {
    const { id } = req.params;

    const attendee = await Attendee.findById(id);

    if (!attendee) {
      return res.status(404).json({
        success: false,
        message: 'Attendee not found',
      });
    }

    await Attendee.update(id, {
      isScanned: true,
      entryTime: new Date(),
    });

    const updatedAttendee = await Attendee.findById(id);

    res.status(200).json({
      success: true,
      message: 'Entry marked successfully',
      data: updatedAttendee,
    });
  } catch (error) {
    console.error('Mark entry error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error marking entry',
      error: error.message,
    });
  }
};
