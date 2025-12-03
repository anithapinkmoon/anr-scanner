import prisma from '../database/prisma.js';
import XLSX from 'xlsx';
import multer from 'multer';

// Configure multer for file uploads
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// @desc    Get student by roll number
// @route   GET /api/students/:rollNumber
// @access  Public
export const getStudentByRollNumber = async (req, res) => {
  try {
    const { rollNumber } = req.params;

    if (!rollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Roll number is required',
      });
    }

    const student = await prisma.student.findUnique({
      where: {
        rollNumber: rollNumber.trim(),
      },
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found with this roll number',
      });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error('Error fetching student:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching student',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Import students from Excel file
// @route   POST /api/students/import
// @access  Public (should be protected in production)
export const importStudentsFromExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Excel file is required',
      });
    }

    // Parse Excel file
    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    if (!data || data.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Excel file is empty or invalid',
      });
    }

    // Process and import students
    const students = [];
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      
      // Map Excel columns (adjust based on your Excel format)
      // Expected columns: Roll Number, Name, Course, Batch, Email (optional), Phone (optional)
      const rollNumber = row['Roll Number'] || row['RollNumber'] || row['Roll No'] || row['RollNo'] || row['ROLL NUMBER'] || '';
      const fullName = row['Name'] || row['Full Name'] || row['FullName'] || row['NAME'] || '';
      const course = row['Course'] || row['COURSE'] || '';
      const batch = row['Batch'] || row['BATCH'] || '';
      const email = row['Email'] || row['EMAIL'] || row['Email Id'] || '';
      const phone = row['Phone'] || row['Phone Number'] || row['PhoneNumber'] || row['PHONE'] || '';

      if (!rollNumber || !fullName) {
        errors.push(`Row ${i + 2}: Missing roll number or name`);
        continue;
      }

      try {
        // Upsert student (create or update if exists)
        const student = await prisma.student.upsert({
          where: { rollNumber: rollNumber.toString().trim() },
          update: {
            fullName: fullName.toString().trim(),
            course: course ? course.toString().trim() : null,
            batch: batch ? batch.toString().trim() : null,
            email: email ? email.toString().trim() : null,
            phone: phone ? phone.toString().trim() : null,
          },
          create: {
            rollNumber: rollNumber.toString().trim(),
            fullName: fullName.toString().trim(),
            course: course ? course.toString().trim() : null,
            batch: batch ? batch.toString().trim() : null,
            email: email ? email.toString().trim() : null,
            phone: phone ? phone.toString().trim() : null,
          },
        });

        students.push(student);
      } catch (error) {
        errors.push(`Row ${i + 2}: ${error.message}`);
      }
    }

    res.json({
      success: true,
      message: `Imported ${students.length} students successfully`,
      data: {
        imported: students.length,
        total: data.length,
        errors: errors.length > 0 ? errors : undefined,
      },
    });
  } catch (error) {
    console.error('Error importing students:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while importing students',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// Export multer middleware
export const uploadMiddleware = upload.single('file');

