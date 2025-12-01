# 📱 Mobile Scanner App - Quick Reference

## Location
The mobile scanner app is in the **`mobile-scanner/`** folder - separate from the main web application.

## Why Separate?
- **Different Users**: Watchmen/security guards use this app
- **Different Purpose**: Only for scanning QR codes
- **Mobile-First**: Built with Expo for native mobile experience
- **Independent**: Can be deployed separately

## Quick Start

```bash
cd mobile-scanner
npm install
npm start
```

## Key Files

- `App.js` - Main scanner app
- `services/api.js` - Backend API integration
- `app.json` - Expo configuration

## Setup Steps

1. **Install dependencies:**
   ```bash
   cd mobile-scanner
   npm install
   ```

2. **Configure backend URL:**
   - Edit `services/api.js`
   - Update `API_BASE_URL` with your computer's IP

3. **Start backend:**
   ```bash
   cd ../server
   npm run dev
   ```

4. **Start mobile app:**
   ```bash
   cd mobile-scanner
   npm start
   ```

5. **Run on phone:**
   - Install Expo Go app
   - Scan QR code from terminal
   - App loads on phone!

## Features

✅ Native camera scanning  
✅ Automatic QR detection  
✅ Real-time verification  
✅ Clear status messages  
✅ Works on Android & iOS  

See `mobile-scanner/README.md` for full documentation.

