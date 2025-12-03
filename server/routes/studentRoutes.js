import express from 'express';
import { getStudentByRollNumber, importStudentsFromExcel, uploadMiddleware } from '../controllers/studentController.js';

const router = express.Router();

// Get student by roll number
router.get('/:rollNumber', getStudentByRollNumber);

// Import students from Excel
router.post('/import', uploadMiddleware, importStudentsFromExcel);

export default router;

