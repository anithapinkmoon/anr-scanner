# API Configuration - Fix Network Error

## 🔧 Current Issue

The app is scanning QR codes successfully, but getting "Network Error" when trying to verify.

This means the API URL in `services/api.js` needs to be updated with your computer's IP address.

## 📍 Step 1: Find Your Computer's IP Address

### Windows:
```bash
ipconfig
```
Look for **"IPv4 Address"** under your active network adapter (usually WiFi or Ethernet)
Example: `192.168.1.105` or `192.168.0.50`

### Mac/Linux:
```bash
ifconfig
# or
ip addr show
```

## 🔧 Step 2: Update API URL

Edit `mobile-scanner/services/api.js`:

```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://YOUR_IP_ADDRESS:5000/api' // Replace with your IP
  : 'https://your-backend-url.com/api';
```

**Example:**
If your IP is `192.168.1.105`, change to:
```javascript
const API_BASE_URL = __DEV__ 
  ? 'http://192.168.1.105:5000/api'
  : 'https://your-backend-url.com/api';
```

## ✅ Step 3: Make Sure Backend is Running

```bash
cd ../server
npm run dev
```

You should see:
```
✅ Prisma Connected to MySQL
🚀 Server running on port 5000
```

## 📱 Step 4: Reload App

1. **In Expo Go:** Shake phone → "Reload"
2. **Or:** Close and reopen Expo Go
3. **Scan QR code again** - should work now!

## 🔍 Step 5: Verify Connection

1. Make sure phone and computer are on **same WiFi network**
2. Test in browser on phone: `http://YOUR_IP:5000/api/health`
   - Should return: `{"success":true,"message":"Server is running"}`
3. If browser works but app doesn't, check firewall settings

## 🐛 Troubleshooting

### Still getting Network Error?

1. **Check IP address is correct**
2. **Check backend is running** (port 5000)
3. **Check same WiFi network**
4. **Check Windows Firewall:**
   - Allow port 5000
   - Or temporarily disable firewall to test

### Can't find IP address?

- Make sure you're connected to WiFi
- Try `ipconfig /all` for more details
- Check router admin panel for connected devices

---

**Once IP is updated, the network error should be fixed!** ✅

