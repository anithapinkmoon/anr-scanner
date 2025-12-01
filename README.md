# 🎉 Golden Jubilee Event Registration & QR Verification System

A complete production-grade MERN stack application for event registration with QR code generation and verification system.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)

## ✨ Features

### Public Features
- **Registration Page**: Attendees can register with their details
- **QR Code Generation**: Automatic QR code generation upon registration
- **QR Code Download**: Download QR code as PNG image

### Mobile Scanner App (Separate)
- **Native Mobile App**: Expo React Native app for watchmen/security guards
- **QR Scanner**: Native camera-based QR code scanning
- **Real-time Verification**: Instant verification with backend API
- **Offline Support**: Works even with poor connection
- **Android & iOS**: Cross-platform mobile app

### Admin Features
- **Secure Login**: JWT-based authentication
- **Dashboard**: Real-time statistics and analytics
- **Attendee Management**: View, search, and filter attendees
- **Export Data**: Export attendees to CSV and PDF
- **Manual Entry Marking**: Manually mark entry for attendees

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **React Router** - Routing
- **Axios** - HTTP client
- **html5-qrcode** - QR code scanning
- **react-hot-toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MySQL** - Database
- **Prisma** - ORM (Object-Relational Mapping)
- **JWT** - Authentication
- **qrcode** - QR code generation
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
anr/
├── mobile-scanner/     # Expo React Native app for watchmen (separate)
├── server/
│   ├── controllers/
│   │   ├── attendeeController.js
│   │   └── adminController.js
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── Attendee.js
│   │   └── Admin.js
│   ├── routes/
│   │   ├── attendeeRoutes.js
│   │   └── adminRoutes.js
│   ├── utils/
│   │   ├── generateAttendeeCode.js
│   │   ├── qrGenerator.js
│   │   └── seed.js
│   ├── config.js
│   ├── index.js
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── QRCard.jsx
│   │   │   ├── QRScanner.jsx
│   │   │   └── Table.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── Register.jsx
│   │   │   ├── Scan.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Attendees.jsx
│   │   ├── utils/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
└── README.md
```

## 🚀 Installation

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v5.7 or higher, or MariaDB)
- npm or yarn

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd anr
```

### Step 2: Install Backend Dependencies
```bash
cd server
npm install
```

### Step 3: Install Frontend Dependencies
```bash
cd ../client
npm install
```

## ⚙️ Configuration

### Backend Configuration

1. Create a `.env` file in the `server` directory:
```bash
cd server
cp .env.example .env
```

2. Update the `.env` file with your configuration:
```env
PORT=5000
DATABASE_URL="mysql://root:your_password@localhost:3306/golden_jubilee"
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

**Important:** 
- Replace `your_password` with your actual MySQL root password
- Format: `mysql://username:password@host:port/database_name`

3. Generate Prisma Client:
```bash
cd server
npm run prisma:generate
```

4. Create database and tables:
```bash
npm run prisma:migrate
```

### Frontend Configuration

1. Create a `.env` file in the `client` directory (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

## 🎯 Usage

### Start MySQL
Make sure MySQL is running on your system:

**Windows:**
- Check Services → Find "MySQL" → Start it
- Or: `net start MySQL80` (as Administrator)

**Mac:**
```bash
brew services start mysql
```

**Linux:**
```bash
sudo systemctl start mysql
```

**Verify MySQL is running:**
```bash
mysql -u root -p
# Enter your password, then type 'exit'
```

### Start Backend Server
```bash
cd server
npm run dev
```
Server will run on `http://localhost:5000`

### Start Frontend Development Server
```bash
cd client
npm run dev
```
Frontend will run on `http://localhost:3000`

### Seed Database (Optional)
To populate the database with sample data:
```bash
cd server
npm run seed
```

## 📡 API Endpoints

### Public Endpoints

#### Register Attendee
```
POST /api/register
Body: {
  fullName: string,
  email: string,
  phone: string,
  designation: string,
  passedOutYear?: number (required if Alumni),
  profilePhoto?: string (base64)
}
```

#### Verify QR Code
```
GET /api/verify?code=<attendeeCode>
```

### Admin Endpoints (Protected)

#### Admin Login
```
POST /api/admin/login
Body: {
  email: string,
  password: string
}
```

#### Get Statistics
```
GET /api/admin/stats
Headers: Authorization: Bearer <token>
```

#### Get Attendees
```
GET /api/admin/attendees?search=<query>&designation=<type>&page=<num>&limit=<num>
Headers: Authorization: Bearer <token>
```

#### Get Single Attendee
```
GET /api/admin/attendees/:id
Headers: Authorization: Bearer <token>
```

#### Mark Entry Manually
```
PATCH /api/admin/attendees/:id/mark-entry
Headers: Authorization: Bearer <token>
```

#### Export CSV
```
GET /api/admin/export/csv
Headers: Authorization: Bearer <token>
```

#### Export PDF
```
GET /api/admin/export/pdf
Headers: Authorization: Bearer <token>
```

## 🎨 Routes

### Public Routes
- `/register` - Registration page
- `/scan` - QR code scanner

### Admin Routes
- `/admin/login` - Admin login
- `/admin/dashboard` - Dashboard with statistics
- `/admin/attendees` - Attendee management

## 🔐 Default Admin Credentials

After seeding the database:
- **Email**: `admin@example.com` (or as set in `.env`)
- **Password**: `admin123` (or as set in `.env`)

**⚠️ Important**: Change these credentials in production!

## 📱 Features in Detail

### Registration Flow
1. User fills registration form
2. System generates unique attendee code (format: `GJ25-<PREFIX>-<ID>`)
3. QR code is generated and stored
4. User receives QR code and can download it

### QR Verification Flow
1. Scanner opens device camera
2. QR code is scanned
3. System verifies code:
   - **Invalid**: Code not found
   - **Duplicate**: Already scanned
   - **Success**: First-time entry, marked as scanned

### Admin Dashboard
- Total registrations count
- Scanned vs pending entries
- Category-wise statistics
- Real-time updates

### Attendee Management
- Search by name, email, phone, or code
- Filter by designation
- Pagination support
- View detailed information
- Manual entry marking
- Export to CSV/PDF

## 🛡️ Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected admin routes
- Input validation
- Error handling

## 🚀 Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure production MySQL database
4. Use environment variables for all secrets
5. Create a dedicated MySQL user (don't use root in production)

### Frontend
1. Build the application:
```bash
cd client
npm run build
```
2. Serve the `dist` folder using a web server (nginx, Apache, etc.)
3. Configure API URL in production environment

## 📝 License

This project is licensed under the ISC License.

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@example.com or create an issue in the repository.

---

**Built with ❤️ for Golden Jubilee Event**

