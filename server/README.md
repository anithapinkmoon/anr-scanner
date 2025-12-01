# Backend Server - Golden Jubilee Event Registration

## Overview
Express.js backend server for the Golden Jubilee Event Registration & QR Verification System.

## Installation

```bash
npm install
```

## Configuration

Create a `.env` file in the server directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/golden-jubilee
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

## Seeding Database

To populate the database with sample data:

```bash
npm run seed
```

## API Documentation

See main README.md for complete API documentation.

## Project Structure

- `controllers/` - Request handlers
- `models/` - MongoDB schemas
- `routes/` - API route definitions
- `middleware/` - Custom middleware (auth, etc.)
- `utils/` - Utility functions (QR generation, code generation, etc.)
- `config.js` - Configuration management
- `index.js` - Server entry point

