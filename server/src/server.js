import { app } from './app.js';
import { connectDB } from './config/db.js';
import { env, requireProductionSecrets } from './config/env.js';

requireProductionSecrets();

try {
  await connectDB();
  app.listen(env.port, () => console.log(`API running on http://localhost:${env.port}`));
} catch (error) {
  console.error('Failed to start server:', error.message);
  process.exit(1);
}
