import { app } from '../server/src/app.js';
import { connectDB } from '../server/src/config/db.js';
import { requireProductionSecrets } from '../server/src/config/env.js';

requireProductionSecrets();

export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Serverless API error:', error);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: 'Serverless API failed to initialize.',
        details: process.env.NODE_ENV === 'production' ? undefined : error.message
      });
    }
  }
}
