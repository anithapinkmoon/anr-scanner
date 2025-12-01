import express from 'express';
import {
  adminLogin,
  getStats,
  getAttendees,
  getAttendeeById,
  markEntry,
  exportCSV,
  exportPDF,
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', adminLogin);
router.get('/stats', protect, getStats);
router.get('/attendees', protect, getAttendees);
router.get('/attendees/:id', protect, getAttendeeById);
router.patch('/attendees/:id/mark-entry', protect, markEntry);
router.get('/export/csv', protect, exportCSV);
router.get('/export/pdf', protect, exportPDF);

export default router;

