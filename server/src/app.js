import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import authRoutes from './routes/authRoutes.js';
import evaluationRoutes from './routes/evaluationRoutes.js';
import rubricRoutes from './routes/rubricRoutes.js';
import workflowRoutes from './routes/workflowRoutes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

export const app = express();

const allowedOrigins = [
  env.clientUrl,
  process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
].filter(Boolean);

app.set('trust proxy', 1);
app.use(helmet());
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) return callback(null, true);
    return callback(null, false);
  },
  credentials: true
}));
app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 300, standardHeaders: true, legacyHeaders: false }));

app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'ok', service: 'openclaw-agent-suite-api', deployment: 'vercel-serverless', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/evaluations', evaluationRoutes);
app.use('/api/rubrics', rubricRoutes);
app.use('/api/workflows', workflowRoutes);

app.use(notFound);
app.use(errorHandler);
