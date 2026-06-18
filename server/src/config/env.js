import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: process.env.PORT || 4100,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/openclaw_agent_suite',
  jwtSecret: process.env.JWT_SECRET || 'dev_only_change_me_before_deploy',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  demoEmail: process.env.DEMO_SEED_EMAIL || 'demo@agentlab.dev',
  demoPassword: process.env.DEMO_SEED_PASSWORD || 'DemoPass123!'
};

export function requireProductionSecrets() {
  if (env.nodeEnv === 'production' && env.jwtSecret === 'dev_only_change_me_before_deploy') {
    throw new Error('JWT_SECRET must be set in production.');
  }
}
