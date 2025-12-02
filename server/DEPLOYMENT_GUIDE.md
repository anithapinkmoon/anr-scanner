# 🚀 Backend Deployment Guide for Vercel

## Overview
This guide explains how to deploy the backend API to Vercel so it can be integrated into the main website using just the API URL.

---

## 📋 Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **MySQL Database** - You need a MySQL database (can use):
   - **PlanetScale** (recommended for Vercel) - Free tier available
   - **Railway** - Easy MySQL setup
   - **Aiven** - Managed MySQL
   - **Your own MySQL server** (if accessible from internet)

3. **Vercel CLI** (optional, can use web interface)
   ```bash
   npm install -g vercel
   ```

---

## 🔧 Step 1: Prepare Database

### Option A: Use PlanetScale (Recommended)
1. Go to [planetscale.com](https://planetscale.com)
2. Create free account
3. Create a new database
4. Copy the connection string (it will look like):
   ```
   mysql://username:password@host:port/database?sslaccept=strict
   ```

### Option B: Use Railway
1. Go to [railway.app](https://railway.app)
2. Create new project → Add MySQL
3. Copy the connection string from the MySQL service

### Option C: Your Own MySQL Server
- Make sure MySQL is accessible from the internet
- Create database: `golden_jubilee` (or your preferred name)
- Connection string format:
  ```
  mysql://username:password@host:port/database
  ```

---

## 🗄️ Step 2: Set Up Database Schema

After you have the database connection string:

1. **Update `.env` file** in `server/` directory:
   ```env
   DATABASE_URL="mysql://username:password@host:port/database"
   JWT_SECRET="your-super-secret-jwt-key-change-this"
   JWT_EXPIRE="7d"
   ADMIN_EMAIL="admin@example.com"
   ADMIN_PASSWORD="admin123"
   PORT=5000
   ```

2. **Run Prisma migrations** (locally):
   ```bash
   cd server
   npm install
   npm run prisma:generate
   npm run prisma:migrate
   ```

   This will create all the tables in your database.

3. **Seed admin user** (optional):
   ```bash
   npm run seed
   ```

---

## 🚀 Step 3: Deploy to Vercel

### Method 1: Using Vercel Web Interface (Easiest)

1. **Go to [vercel.com](https://vercel.com) and login**

2. **Click "Add New Project"**

3. **Import your Git repository** (GitHub/GitLab/Bitbucket)
   - If not using Git, you can drag and drop the `server` folder

4. **Configure Project Settings:**
   - **Root Directory**: Set to `server` (if deploying from monorepo)
   - **Framework Preset**: Other
   - **Build Command**: Leave empty (or `npm run prisma:generate`)
   - **Output Directory**: Leave empty
   - **Install Command**: `npm install`

5. **Add Environment Variables:**
   Click "Environment Variables" and add:
   ```
   DATABASE_URL = mysql://username:password@host:port/database
   JWT_SECRET = your-super-secret-jwt-key
   JWT_EXPIRE = 7d
   ADMIN_EMAIL = admin@example.com
   ADMIN_PASSWORD = admin123
   NODE_ENV = production
   FRONTEND_URL = https://your-frontend-domain.com (optional, for CORS)
   ```

6. **Click "Deploy"**

7. **Wait for deployment** - Vercel will build and deploy your API

8. **Get your API URL** - After deployment, you'll get a URL like:
   ```
   https://your-project-name.vercel.app
   ```

### Method 2: Using Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Navigate to server directory:**
   ```bash
   cd server
   ```

3. **Login to Vercel:**
   ```bash
   vercel login
   ```

4. **Deploy:**
   ```bash
   vercel
   ```

5. **Add environment variables:**
   ```bash
   vercel env add DATABASE_URL
   vercel env add JWT_SECRET
   vercel env add JWT_EXPIRE
   vercel env add ADMIN_EMAIL
   vercel env add ADMIN_PASSWORD
   vercel env add NODE_ENV
   ```

6. **Deploy to production:**
   ```bash
   vercel --prod
   ```

---

## ✅ Step 4: Verify Deployment

1. **Test Health Endpoint:**
   ```
   GET https://your-api-url.vercel.app/api/health
   ```
   Should return: `{ "success": true, "message": "Server is running" }`

2. **Test Registration Endpoint:**
   ```
   POST https://your-api-url.vercel.app/api/register
   Content-Type: application/json
   
   {
     "fullName": "Test User",
     "phone": "1234567890",
     "designation": "Student"
   }
   ```

---

## 🔗 Step 5: Provide API URL to Integration Team

Once deployed, provide the following to the other team:

### **API Base URL:**
```
https://your-project-name.vercel.app/api
```

### **Available Endpoints:**

**Public Endpoints:**
- `POST /api/register` - Register attendee
- `GET /api/verify?code=<code>` - Verify QR code

**Admin Endpoints (Protected):**
- `POST /api/admin/login` - Admin login
- `GET /api/admin/stats` - Get statistics
- `GET /api/admin/attendees` - Get attendees list
- `PATCH /api/admin/attendees/:id/mark-entry` - Mark entry
- `GET /api/admin/export/csv` - Export CSV
- `GET /api/admin/export/pdf` - Export PDF

### **Database Credentials:**
Provide the database connection details to the other team:
- Database Host
- Database Port
- Database Name
- Username
- Password
- Connection String (if they need it)

**⚠️ Important:** Make sure they understand:
- They will store data in this database
- They should not modify the schema without coordinating
- They can access the database for their own queries/reports

---

## 🔐 Step 6: Security Considerations

1. **Change Default Admin Credentials:**
   - Update `ADMIN_EMAIL` and `ADMIN_PASSWORD` in Vercel environment variables
   - Use strong passwords

2. **Use Strong JWT Secret:**
   - Generate a random string for `JWT_SECRET`
   - Don't use default values

3. **CORS Configuration:**
   - Set `FRONTEND_URL` environment variable to your frontend domain
   - This restricts API access to your frontend only

4. **Database Security:**
   - Use strong database passwords
   - Limit database access to necessary IPs only
   - Don't expose database credentials publicly

---

## 📝 Step 7: Integration Example

The other team can integrate your API like this:

### JavaScript/Fetch Example:
```javascript
// Register attendee
const response = await fetch('https://your-api-url.vercel.app/api/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    fullName: 'John Doe',
    email: 'john@example.com',
    phone: '1234567890',
    designation: 'Alumni',
    // ... other fields
  })
});

const data = await response.json();
```

### cURL Example:
```bash
curl -X POST https://your-api-url.vercel.app/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "phone": "1234567890",
    "designation": "Student"
  }'
```

---

## 🐛 Troubleshooting

### Issue: Database Connection Error
- **Check:** DATABASE_URL is correct in Vercel environment variables
- **Check:** Database is accessible from internet (not localhost)
- **Check:** Database credentials are correct

### Issue: Prisma Client Not Generated
- **Solution:** Add build command in Vercel: `npm run prisma:generate`
- Or run locally and commit the generated Prisma client

### Issue: CORS Errors
- **Solution:** Set `FRONTEND_URL` environment variable in Vercel
- Or update CORS configuration in `server/index.js`

### Issue: Routes Not Working
- **Check:** Vercel configuration in `server/vercel.json` is correct
- **Check:** API routes are under `/api` path

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Check Vercel function logs
3. Test endpoints using Postman or curl
4. Verify environment variables are set correctly

---

## 🎯 Summary

**What you're providing:**
1. ✅ Deployed API URL (e.g., `https://your-api.vercel.app/api`)
2. ✅ Database credentials and connection details
3. ✅ API documentation (endpoints listed above)

**What the other team will do:**
1. Integrate API calls into their existing frontend
2. Store data in your database
3. Use the API URL without needing your code

**You keep:**
- Your source code (not shared)
- Control over the API
- Database access for your own queries

---

**Deployment Complete! 🎉**

