// Vercel serverless function entry point
import app from '../index.js';

// Vercel expects a default export that handles requests
export default async (req, res) => {
  return app(req, res);
};

