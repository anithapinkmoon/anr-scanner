import express from 'express';
import { registerAttendee, verifyQRCode } from '../controllers/attendeeController.js';

const router = express.Router();

router.post('/register', registerAttendee);
router.get('/verify', verifyQRCode);

export default router;

