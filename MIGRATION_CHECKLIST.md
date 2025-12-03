# 📦 Migration Checklist: Moving to New Repository

## ✅ Pre-Migration Checklist

### 1. **Code Repository**
- [ ] Push all code to new company repository
- [ ] Ensure all branches are pushed
- [ ] Verify all files are included (check `.gitignore`)
- [ ] No hardcoded repository URLs in code

### 2. **Environment Variables**
- [ ] Document all environment variables needed
- [ ] List all secrets and API keys
- [ ] No hardcoded credentials in code

---

## 🔄 Deployment Updates Required

### **Vercel (Backend & Frontend)**

#### Backend Deployment:
1. **Disconnect old repository:**
   - Go to Vercel Dashboard → Your Project → Settings → Git
   - Disconnect current repository

2. **Connect new repository:**
   - Click "Connect Git Repository"
   - Select your new company repository
   - Choose the branch (usually `main` or `master`)

3. **Update project settings:**
   - **Root Directory**: `server` (for backend)
   - **Build Command**: `npm run build` (or leave empty)
   - **Output Directory**: (leave empty for backend)
   - **Install Command**: `npm install`

4. **Re-add environment variables:**
   - Go to Settings → Environment Variables
   - Add all required variables:
     ```
     DATABASE_URL
     JWT_SECRET
     JWT_EXPIRE
     ADMIN_EMAIL
     ADMIN_PASSWORD
     NODE_ENV
     FRONTEND_URL (optional)
     ```

5. **Redeploy:**
   - Go to Deployments tab
   - Click "Redeploy" or push to trigger new deployment

#### Frontend Deployment:
1. **Same steps as backend:**
   - Connect new repository
   - **Root Directory**: `client` (for frontend)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

2. **Update environment variables (if any):**
   - `VITE_API_URL` (if using)
   - Any other frontend env vars

---

### **Railway (Database)**

#### Database Connection:
- ✅ **No changes needed!**
- Railway database is independent of repository
- Just update `DATABASE_URL` in Vercel environment variables
- Database will continue working as before

#### If moving database:
1. Export data from old Railway database
2. Create new database in Railway
3. Import data
4. Update `DATABASE_URL` in Vercel

---

### **Expo EAS (Mobile App)**

#### EAS Build Configuration:
1. **Update GitHub connection:**
   - Go to Expo Dashboard → Your Project → Settings → GitHub
   - Disconnect old repository
   - Connect new repository
   - Update base directory: `/mobile-scanner`

2. **Verify `app.json`:**
   - Check `projectId` is correct
   - Check `slug` matches Expo project

3. **No code changes needed:**
   - EAS will pull from new repository
   - Builds will work automatically

---

## 🔍 Files to Check/Update

### Configuration Files (No changes needed):
- ✅ `server/vercel.json` - Works with any repo
- ✅ `client/vercel.json` - Works with any repo
- ✅ `server/api/index.js` - No repo references
- ✅ `mobile-scanner/eas.json` - No repo references
- ✅ `mobile-scanner/app.json` - No repo references

### Files with potential issues:
- ⚠️ Check for hardcoded URLs in:
  - `client/src/services/apiService.js` - API URL
  - `client/src/utils/api.js` - API URL
  - `mobile-scanner/services/api.js` - API URL

---

## 📝 Step-by-Step Migration Process

### Step 1: Prepare New Repository
```bash
# Clone new repository
git clone <new-company-repo-url>
cd <new-repo-name>

# Copy all files from current project
cp -r <current-project>/* .

# Commit and push
git add .
git commit -m "Initial migration from old repository"
git push origin main
```

### Step 2: Update Vercel Backend
1. Go to Vercel Dashboard
2. Select backend project
3. Settings → Git → Disconnect
4. Connect new repository
5. Update Root Directory: `server`
6. Re-add environment variables
7. Redeploy

### Step 3: Update Vercel Frontend
1. Go to Vercel Dashboard
2. Select frontend project
3. Settings → Git → Disconnect
4. Connect new repository
5. Update Root Directory: `client`
6. Re-add environment variables (if any)
7. Redeploy

### Step 4: Update Expo EAS
1. Go to Expo Dashboard
2. Project Settings → GitHub
3. Disconnect old repo
4. Connect new repo
5. Update base directory: `/mobile-scanner`

### Step 5: Test Everything
- [ ] Backend API works
- [ ] Frontend loads correctly
- [ ] Database connection works
- [ ] Mobile app builds successfully
- [ ] All features work as expected

---

## ⚠️ Potential Issues & Solutions

### Issue 1: Vercel deployment fails
**Solution:**
- Check Root Directory is correct
- Verify Build Command
- Check environment variables are set

### Issue 2: Database connection fails
**Solution:**
- Verify `DATABASE_URL` in Vercel environment variables
- Check Railway database is still running
- Test connection string

### Issue 3: Frontend can't connect to backend
**Solution:**
- Update API URL in frontend code (if hardcoded)
- Check CORS settings in backend
- Verify `FRONTEND_URL` environment variable

### Issue 4: EAS build fails
**Solution:**
- Verify GitHub connection
- Check base directory path
- Ensure `app.json` has correct `projectId`

---

## ✅ Post-Migration Checklist

- [ ] All deployments working
- [ ] Environment variables configured
- [ ] Database connected
- [ ] Frontend loads correctly
- [ ] Backend API responds
- [ ] Mobile app builds successfully
- [ ] All features tested
- [ ] Old repository can be archived

---

## 📞 Support

If you encounter issues:
1. Check deployment logs in Vercel/Expo
2. Verify environment variables
3. Check database connection
4. Review error messages in console

---

## 🎉 Summary

**What needs updating:**
- ✅ Vercel: Connect new repository
- ✅ Expo EAS: Connect new repository
- ✅ Environment variables: Re-add in Vercel
- ❌ Railway: No changes needed
- ❌ Code: No changes needed

**Time estimate:** 30-60 minutes

**Risk level:** Low (all deployments are reversible)

