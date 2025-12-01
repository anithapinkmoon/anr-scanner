# MySQL Database Setup Guide

## 🗄️ MySQL Setup Instructions

### Step 1: Install MySQL

**Windows:**
1. Download MySQL from: https://dev.mysql.com/downloads/installer/
2. Run the installer
3. Choose "Developer Default" or "Server only"
4. Set root password (remember this!)
5. Complete installation

**Mac:**
```bash
brew install mysql
brew services start mysql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
sudo mysql_secure_installation
```

---

### Step 2: Verify MySQL is Running

```bash
# Check MySQL status
mysql --version

# Connect to MySQL
mysql -u root -p
# Enter your root password when prompted
```

If you can connect, MySQL is working! Type `exit` to leave.

---

### Step 3: Create Database (Optional - Auto-created)

The application will automatically create the database and tables when you first run it!

**OR manually create:**

```sql
CREATE DATABASE golden_jubilee;
USE golden_jubilee;
```

---

### Step 4: Configure Your Application

Create a `.env` file in the `server` folder:

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_root_password
DB_NAME=golden_jubilee
JWT_SECRET=golden-jubilee-secret-key-2024
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

**Important:** Replace `your_mysql_root_password` with your actual MySQL root password!

---

### Step 5: Install Dependencies

```bash
cd server
npm install
```

This will install `mysql2` package.

---

### Step 6: Start Your Server

```bash
cd server
npm run dev
```

**Expected Output:**
```
✅ Database tables initialized
✅ MySQL Connected
🚀 Server running on port 5000
```

If you see this, your MySQL database is connected! ✅

---

### Step 7: Seed Database (Optional)

```bash
cd server
npm run seed
```

This will create:
- Admin user (admin@example.com / admin123)
- 8 sample attendees with QR codes

---

## 🔍 Verify Database

**Using MySQL Command Line:**
```bash
mysql -u root -p
```

```sql
USE golden_jubilee;
SHOW TABLES;
SELECT * FROM attendees;
SELECT * FROM admins;
```

**Using MySQL Workbench (GUI):**
1. Open MySQL Workbench
2. Connect to your MySQL server
3. Navigate to `golden_jubilee` database
4. View `attendees` and `admins` tables

---

## 🐛 Troubleshooting

### Issue: "Access denied for user 'root'@'localhost'"

**Problem:** Wrong password or user doesn't exist

**Solution:**
1. Check your `.env` file - verify `DB_PASSWORD`
2. Try resetting MySQL root password
3. Or create a new MySQL user:

```sql
CREATE USER 'golden_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON golden_jubilee.* TO 'golden_user'@'localhost';
FLUSH PRIVILEGES;
```

Then update `.env`:
```env
DB_USER=golden_user
DB_PASSWORD=your_password
```

---

### Issue: "Can't connect to MySQL server"

**Problem:** MySQL service is not running

**Solution:**

**Windows:**
- Check Services → Find "MySQL" → Start it
- Or: Open Command Prompt as Admin → `net start MySQL80`

**Mac:**
```bash
brew services start mysql
```

**Linux:**
```bash
sudo systemctl start mysql
# or
sudo service mysql start
```

---

### Issue: "Unknown database 'golden_jubilee'"

**Problem:** Database doesn't exist

**Solution:**
The app will create it automatically! Just make sure:
1. MySQL is running
2. User has CREATE DATABASE permission
3. Check `.env` file has correct credentials

---

### Issue: "Table doesn't exist"

**Problem:** Tables weren't created

**Solution:**
1. Stop the server
2. Delete the database: `DROP DATABASE golden_jubilee;`
3. Restart server - it will recreate everything

---

## 📊 Database Structure

### Tables Created:

1. **`attendees`** - Stores all registered attendees
   - Fields: id, fullName, email, phone, designation, passedOutYear, profilePhoto, attendeeCode, qrCode, isScanned, entryTime, createdAt

2. **`admins`** - Stores admin users
   - Fields: id, email, password (hashed), createdAt

---

## ✅ Quick Setup Checklist

- [ ] MySQL is installed and running
- [ ] Can connect to MySQL (`mysql -u root -p`)
- [ ] Created `.env` file in `server/` folder
- [ ] Set `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` in `.env`
- [ ] Installed dependencies (`npm install`)
- [ ] Started backend server (`npm run dev`)
- [ ] Saw "✅ MySQL Connected" message
- [ ] (Optional) Ran seed script (`npm run seed`)
- [ ] Verified database in MySQL Workbench or command line

---

## 🎯 Next Steps

Once database is set up:

1. **Start Backend:**
   ```bash
   cd server
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   cd client
   npm run dev
   ```

3. **Test Registration:**
   - Go to http://localhost:3000/register
   - Register a user
   - Check MySQL to see the new attendee!

---

**Your MySQL database is ready! 🎉**

