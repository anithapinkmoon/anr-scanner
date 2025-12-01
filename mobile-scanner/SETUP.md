# Quick Setup Guide - Mobile Scanner App

## 🚀 Quick Start (5 minutes)

### Step 1: Install Expo CLI

```bash
npm install -g expo-cli
# or
npm install -g @expo/cli
```

### Step 2: Install Dependencies

```bash
cd mobile-scanner
npm install
```

### Step 3: Configure Backend URL

1. **Find your computer's IP address:**

   **Windows:**
   ```bash
   ipconfig
   # Look for "IPv4 Address" (e.g., 192.168.1.100)
   ```

   **Mac/Linux:**
   ```bash
   ifconfig
   # or
   ip addr show
   ```

2. **Update `services/api.js`:**

   ```javascript
   const API_BASE_URL = 'http://192.168.1.100:5000/api';
   // Replace 192.168.1.100 with YOUR IP address
   ```

### Step 4: Start Backend Server

```bash
cd ../server
npm run dev
```

Make sure it's running on port 5000.

### Step 5: Start Expo App

```bash
cd mobile-scanner
npm start
# or
expo start
```

### Step 6: Run on Phone

**Option A: Expo Go (Easiest)**
1. Install "Expo Go" app from Play Store/App Store
2. Scan QR code shown in terminal
3. App loads on phone!

**Option B: Development Build**
```bash
npm run android  # For Android
npm run ios      # For iOS (Mac only)
```

## ✅ Testing Checklist

- [ ] Backend is running
- [ ] IP address configured correctly
- [ ] Phone and computer on same WiFi
- [ ] Expo Go app installed
- [ ] Camera permission granted
- [ ] Can scan QR codes
- [ ] Verification works

## 🎯 Usage Flow

1. **Watchman opens app** on phone
2. **Camera automatically starts**
3. **Points at QR code** - scans automatically
4. **See result:**
   - ✅ Success = Green message
   - ⚠️ Duplicate = Yellow warning
   - ❌ Invalid = Red error
5. **Tap "Scan Again"** for next attendee

## 🔧 Common Issues

### "Network request failed"

**Problem:** Can't connect to backend

**Solution:**
- Check IP address in `api.js`
- Make sure backend is running
- Phone and computer on same WiFi
- Check firewall settings

### "Camera permission denied"

**Solution:**
- Go to phone Settings
- Find app permissions
- Enable camera

### "Expo Go can't connect"

**Solution:**
- Make sure phone and computer on same WiFi
- Try restarting Expo: `expo start -c`
- Check if port 19000 is open

## 📱 Production Deployment

For production use:

1. **Build APK/IPA:**
   ```bash
   eas build --platform android
   ```

2. **Update API URL:**
   - Change to production backend URL
   - Use HTTPS

3. **Distribute:**
   - Install APK on watchmen's phones
   - Or publish to Play Store/App Store

---

**Ready to scan! 📱✨**

