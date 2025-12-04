import express from 'express';
import { registerAttendee, verifyQRCode, getRegisteredAttendees } from '../controllers/attendeeController.js';

const router = express.Router();

router.post('/register', registerAttendee);
router.get('/verify', verifyQRCode);
router.get('/attendees', getRegisteredAttendees);

export default router;

