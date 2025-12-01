# Frontend Client - Golden Jubilee Event Registration

## Overview
React + Vite frontend application for the Golden Jubilee Event Registration & QR Verification System.

## Installation

```bash
npm install
```

## Configuration

Optional: Create a `.env` file in the client directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Development Mode
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Features

- **Registration Page**: User-friendly registration form
- **QR Scanner**: Real-time camera-based QR scanning
- **Admin Panel**: Complete admin dashboard with statistics
- **Responsive Design**: Mobile-first approach with TailwindCSS
- **Toast Notifications**: User feedback with react-hot-toast

## Project Structure

- `components/` - Reusable React components
- `pages/` - Page components (routes)
- `context/` - React Context providers (Auth)
- `utils/` - Utility functions (API client)
- `App.jsx` - Main application component
- `main.jsx` - Application entry point

## Technologies

- React 18
- Vite
- TailwindCSS
- React Router
- Axios
- html5-qrcode
- react-hot-toast

