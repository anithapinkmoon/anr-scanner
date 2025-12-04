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
    
    // Process ALL sheets in the Excel file
    const students = [];
    const errors = [];
    let totalRows = 0;

    // Loop through all sheets
    for (let sheetIndex = 0; sheetIndex < workbook.SheetNames.length; sheetIndex++) {
      const sheetName = workbook.SheetNames[sheetIndex];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);

      if (!data || data.length === 0) {
        errors.push(`Sheet "${sheetName}": Empty or no data`);
        continue;
      }

      console.log(`Processing sheet "${sheetName}" with ${data.length} rows`);

      // Process each row in this sheet
      for (let i = 0; i < data.length; i++) {
        totalRows++;
      const row = data[i];
      
      // Map Excel columns - based on actual Excel format: S.No., NAME, COURSE, ROLL NO, BATCH
      // Try multiple variations to handle different Excel formats
      const rollNumber = row['ROLL NO'] || row['Roll No'] || row['Roll No.'] || row['ROLL NO.'] ||
                        row['Roll Number'] || row['RollNumber'] || row['RollNo'] || 
                        row['ROLL NUMBER'] || row['ROLL_NUMBER'] || row['Roll_Number'] ||
                        row['roll no'] || row['rollno'] || row['ROLLNO'] || '';
      
      const fullName = row['NAME'] || row['Name'] || row['Full Name'] || row['FullName'] ||
                      row['FULL NAME'] || row['FULL_NAME'] || row['Full_Name'] ||
                      row['Student Name'] || row['StudentName'] || row['STUDENT NAME'] ||
                      row['name'] || row['full name'] || '';
      
      const course = row['COURSE'] || row['Course'] || row['Course Name'] || row['CourseName'] ||
                    row['COURSE NAME'] || row['course'] || row['Program'] || row['PROGRAM'] || '';
      
      const batch = row['BATCH'] || row['Batch'] || row['Batch Year'] || row['BatchYear'] ||
                   row['BATCH YEAR'] || row['batch'] || row['Year'] || row['YEAR'] ||
                   row['Academic Year'] || row['AcademicYear'] || row['ACADEMIC YEAR'] || '';
      
      const email = row['Email'] || row['EMAIL'] || row['Email Id'] || row['EmailId'] ||
                   row['EMAIL ID'] || row['Email Address'] || row['EmailAddress'] ||
                   row['email'] || row['E-mail'] || '';
      
      const phone = row['Phone'] || row['PHONE'] || row['Phone Number'] || row['PhoneNumber'] ||
                   row['PHONE NUMBER'] || row['Mobile'] || row['MOBILE'] ||
                   row['Mobile Number'] || row['MobileNumber'] || row['MOBILE NUMBER'] ||
                   row['phone'] || row['mobile'] || row['Contact'] || row['CONTACT'] || '';

      if (!rollNumber || !fullName) {
        errors.push(`Sheet "${sheetName}", Row ${i + 2}: Missing roll number or name`);
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
        errors.push(`Sheet "${sheetName}", Row ${i + 2}: ${error.message}`);
      }
      }
    }

    res.json({
      success: true,
      message: `Imported ${students.length} students from ${workbook.SheetNames.length} sheet(s) successfully`,
      data: {
        imported: students.length,
        total: totalRows,
        sheetsProcessed: workbook.SheetNames.length,
        sheetNames: workbook.SheetNames,
        errors: errors.length > 0 ? errors.slice(0, 100) : undefined, // Limit errors to first 100
        totalErrors: errors.length,
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

