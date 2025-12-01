# 📱 Golden Jubilee Mobile Scanner App

A dedicated Expo React Native app for watchmen/security guards to scan QR codes at the event gate.

## 🚀 Features

- ✅ **Native QR Scanner** - Uses device camera for fast scanning
- ✅ **Real-time Verification** - Instantly verifies QR codes with backend
- ✅ **Clear Status Display** - Big, clear success/error messages
- ✅ **Works Offline** - Basic functionality even with poor connection
- ✅ **Android & iOS** - Works on both platforms

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (for testing)

## 🛠️ Installation

1. **Install Dependencies:**
   ```bash
   cd mobile-scanner
   npm install
   ```

2. **Configure API URL:**
   
   Open `services/api.js` and update the `API_BASE_URL`:
   
   ```javascript
   const API_BASE_URL = __DEV__ 
     ? 'http://YOUR_COMPUTER_IP:5000/api' // Replace with your IP
     : 'https://your-backend-url.com/api';
   ```
   
   **To find your IP:**
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr show`

3. **Start Development Server:**
   ```bash
   npm start
   # or
   expo start
   ```

## 📱 Running on Device

### Method 1: Expo Go (Easiest for Testing)

1. **Install Expo Go:**
   - Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Start Expo:**
   ```bash
   npm start
   ```

3. **Scan QR Code:**
   - Open Expo Go app
   - Scan the QR code shown in terminal
   - App will load on your phone

### Method 2: Development Build

1. **For Android:**
   ```bash
   npm run android
   ```

2. **For iOS:**
   ```bash
   npm run ios
   ```

## 🔧 Configuration

### Update Backend URL

Edit `services/api.js`:

```javascript
const API_BASE_URL = 'http://192.168.1.100:5000/api';
// Replace 192.168.1.100 with your computer's IP address
```

**Important:** 
- Make sure phone and computer are on same WiFi
- Backend must be running
- Use your computer's local IP, not `localhost`

## 🎯 Usage

1. **Open App** on watchman's phone
2. **Point Camera** at attendee's QR code
3. **Automatic Scan** - No button needed, scans automatically
4. **See Result:**
   - ✅ Green = Entry verified
   - ⚠️ Yellow = Already scanned
   - ❌ Red = Invalid code
5. **Scan Again** - Tap "Scan Again" button

## 📦 Building for Production

### Android APK

```bash
eas build --platform android
```

### iOS IPA

```bash
eas build --platform ios
```

**Note:** Requires Expo account and EAS (Expo Application Services)

## 🐛 Troubleshooting

### Camera Not Working

1. **Check Permissions:**
   - Go to phone settings
   - Find app permissions
   - Enable camera access

2. **Restart App:**
   - Close app completely
   - Reopen

### Can't Connect to Backend

1. **Check IP Address:**
   - Make sure IP in `api.js` is correct
   - Phone and computer must be on same WiFi

2. **Check Backend:**
   - Make sure backend is running
   - Test: `http://YOUR_IP:5000/api/health`

3. **Firewall:**
   - Allow port 5000 in firewall
   - Windows: Check Windows Firewall settings

### App Won't Load

1. **Clear Cache:**
   ```bash
   expo start -c
   ```

2. **Reinstall Dependencies:**
   ```bash
   rm -rf node_modules
   npm install
   ```

## 📱 App Structure

```
mobile-scanner/
├── App.js              # Main app component
├── services/
│   └── api.js         # API integration
├── assets/            # Images, icons
├── app.json           # Expo configuration
└── package.json       # Dependencies
```

## 🔐 Security Notes

- For production, use HTTPS
- Store API URL in environment variables
- Consider adding authentication for scanner app

## 📞 Support

For issues or questions, check the main project README.

---

**Built with Expo & React Native** 🚀

