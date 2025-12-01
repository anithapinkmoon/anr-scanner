# Prisma Setup Guide

## 🚀 Quick Setup with Prisma

Prisma makes database operations much cleaner and easier to understand! Here's how to set it up.

---

### Step 1: Install Dependencies

```bash
cd server
npm install
```

This will install:
- `@prisma/client` - Prisma Client for database operations
- `prisma` - Prisma CLI (dev dependency)

---

### Step 2: Configure Database URL

Create a `.env` file in the `server` folder:

```env
PORT=5000
DATABASE_URL="mysql://root:your_password@localhost:3306/golden_jubilee"
JWT_SECRET=golden-jubilee-secret-key-2024
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

**Important:** 
- Replace `your_password` with your MySQL root password
- Format: `mysql://username:password@host:port/database_name`

---

### Step 3: Generate Prisma Client

```bash
cd server
npm run prisma:generate
```

This creates the Prisma Client based on your schema.

---

### Step 4: Create Database & Tables

```bash
cd server
npm run prisma:migrate
```

This will:
- Create the database if it doesn't exist
- Create all tables (attendees, admins)
- Set up indexes and relationships

**Or manually create database first:**
```sql
CREATE DATABASE golden_jubilee;
```

Then run the migrate command.

---

### Step 5: Start Your Server

```bash
cd server
npm run dev
```

**Expected Output:**
```
✅ Prisma Connected to MySQL
🚀 Server running on port 5000
```

---

### Step 6: Seed Database (Optional)

```bash
cd server
npm run seed
```

---

## 📚 Understanding Prisma Code

### Before (Raw SQL):
```javascript
const [rows] = await pool.query(
  'SELECT * FROM attendees WHERE email = ?',
  [email]
);
```

### After (Prisma):
```javascript
const attendee = await prisma.attendee.findFirst({
  where: { email }
});
```

**Much cleaner and easier to read!** ✨

---

## 🎯 Prisma Commands

```bash
# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Create and run migrations
npm run prisma:migrate

# Open Prisma Studio (visual database browser)
npm run prisma:studio
```

---

## 🔍 Prisma Studio

Visual database browser - see your data in a nice UI:

```bash
npm run prisma:studio
```

Opens at: http://localhost:5555

---

## 📊 Schema File

The schema is in `server/prisma/schema.prisma`:

```prisma
model Attendee {
  id            Int       @id @default(autoincrement())
  fullName      String
  email         String    @unique
  designation   Designation
  // ... more fields
}
```

This defines your database structure in a clean, readable format!

---

## 🐛 Troubleshooting

### Issue: "Prisma Client not generated"

**Solution:**
```bash
npm run prisma:generate
```

### Issue: "Database connection failed"

**Check:**
1. MySQL is running
2. `DATABASE_URL` in `.env` is correct
3. Database exists (or run migration)

### Issue: "Table doesn't exist"

**Solution:**
```bash
npm run prisma:migrate
```

---

## ✅ Benefits of Prisma

1. **Type Safety** - Auto-completion and type checking
2. **Clean Code** - No raw SQL strings
3. **Easy Migrations** - Schema changes are versioned
4. **Prisma Studio** - Visual database browser
5. **Better DX** - Great developer experience

---

**Your Prisma setup is ready! 🎉**

