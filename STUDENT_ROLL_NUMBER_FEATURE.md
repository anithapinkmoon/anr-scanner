# 📚 Student Roll Number Feature

## ✅ What Was Implemented

### 1. Database Schema Updates
- Added `Student` model to store student data from Excel
- Added `rollNumber`, `course`, and `batch` fields to `Attendee` model

### 2. Backend API Endpoints
- `GET /api/students/:rollNumber` - Lookup student by roll number
- `POST /api/students/import` - Import students from Excel file

### 3. Frontend Features
- Roll number input field (required for students)
- Auto-fill functionality:
  - When student enters roll number, automatically fills:
    - Name
    - Course
    - Batch
    - Email (if available)
    - Phone (if available)
- Course and Batch fields are read-only (auto-filled)

---

## 🚀 Setup Steps

### Step 1: Install Dependencies

```bash
cd server
npm install
```

This will install:
- `xlsx` - For Excel file parsing
- `multer` - For file uploads

### Step 2: Run Database Migrations

```bash
cd server
npm run prisma:generate
npx prisma db push
```

This will:
- Create `students` table
- Add `rollNumber`, `course`, `batch` fields to `attendees` table

### Step 3: Deploy Backend

After migrations, redeploy your backend to Vercel.

---

## 📊 How to Import Excel File

### Excel File Format

Your Excel file should have these columns (case-insensitive):
- **Roll Number** (required)
- **Name** or **Full Name** (required)
- **Course** (optional)
- **Batch** (optional)
- **Email** (optional)
- **Phone** or **Phone Number** (optional)

### Example Excel Format:

| Roll Number | Name | Course | Batch | Email | Phone |
|------------|------|--------|-------|-------|-------|
| 2021CSE001 | John Doe | B.Sc. CSE | 2021-2024 | john@example.com | 1234567890 |
| 2021CSE002 | Jane Smith | B.Sc. CSE | 2021-2024 | jane@example.com | 9876543210 |

### Import via API

**Endpoint:** `POST /api/students/import`

**Using cURL:**
```bash
curl -X POST https://anr-scanner-t1b3.vercel.app/api/students/import \
  -F "file=@students.xlsx"
```

**Using JavaScript:**
```javascript
const formData = new FormData();
formData.append('file', excelFile);

const response = await fetch('https://anr-scanner-t1b3.vercel.app/api/students/import', {
  method: 'POST',
  body: formData
});
```

**Response:**
```json
{
  "success": true,
  "message": "Imported 100 students successfully",
  "data": {
    "imported": 100,
    "total": 100,
    "errors": []
  }
}
```

---

## 🎯 How It Works

### For Students Registering:

1. **Select "Student" designation**
2. **Enter Roll Number** (required)
3. **Auto-fill happens:**
   - System looks up student by roll number
   - If found, automatically fills:
     - Name
     - Course
     - Batch
     - Email (if available)
     - Phone (if available)
4. **User can edit** name, email, phone if needed
5. **Course and Batch** are read-only (from database)
6. **Submit registration**

### Roll Number Lookup:

- Happens automatically when roll number is entered
- Shows loading spinner while searching
- If student not found, user can enter details manually
- No error shown if student not found (allows manual entry)

---

## 📝 API Endpoints

### 1. Get Student by Roll Number
```
GET /api/students/:rollNumber
```

**Example:**
```
GET /api/students/2021CSE001
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "rollNumber": "2021CSE001",
    "fullName": "John Doe",
    "course": "B.Sc. CSE",
    "batch": "2021-2024",
    "email": "john@example.com",
    "phone": "1234567890"
  }
}
```

**Response (Not Found):**
```json
{
  "success": false,
  "message": "Student not found with this roll number"
}
```

### 2. Import Students from Excel
```
POST /api/students/import
Content-Type: multipart/form-data
```

**Body:**
- `file`: Excel file (.xlsx or .xls)

---

## 🔧 Frontend Code

The student fields are added to the registration form:

```jsx
{formData.designation === 'Student' && (
  <div className="space-y-4 bg-green-50 border border-green-200 rounded-lg p-4">
    <h3>Student Information</h3>
    <input name="rollNumber" required />
    <input name="course" readOnly />
    <input name="batch" readOnly />
  </div>
)}
```

---

## ✅ Testing

1. **Import Excel file:**
   ```bash
   curl -X POST https://your-api-url/api/students/import \
     -F "file=@students.xlsx"
   ```

2. **Test roll number lookup:**
   ```bash
   curl https://your-api-url/api/students/2021CSE001
   ```

3. **Test registration:**
   - Go to registration form
   - Select "Student"
   - Enter roll number
   - Verify auto-fill works

---

## 📋 Next Steps

1. ✅ Run migrations: `npx prisma db push`
2. ✅ Install packages: `npm install` in server folder
3. ✅ Deploy backend
4. ✅ Import Excel file with student data
5. ✅ Test registration with roll number

---

## 🎉 Summary

**What works:**
- ✅ Students can enter roll number
- ✅ System auto-fills name, course, batch
- ✅ Excel import functionality
- ✅ Roll number lookup API

**What you need to do:**
1. Run database migrations
2. Install npm packages
3. Import your Excel file
4. Test the registration

---

**Feature Complete! 🚀**

