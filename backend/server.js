import 'dotenv/config';
import app from './src/app.js';
import { connectDatabase } from './src/config/database.js';
import { seedServices } from './src/config/seedServices.js';

const port = process.env.PORT || 5001;

try {
  await connectDatabase();
  await seedServices();
  app.listen(port, () => console.log(`Wrenchly API listening on port ${port}`));
} catch (error) {
  console.error('API startup failed:', error.message);
  process.exit(1);
}