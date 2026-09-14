// src/index.ts
import 'dotenv/config';
import { connectToWhatsApp } from './bot/connection';
import { logger } from './utils/logger';

async function main() {
  logger.info('Iniciando AsistMalek...');
  await connectToWhatsApp();
}

main().catch((err) => {
  logger.error(`Error fatal: ${err.message}`);
  process.exit(1);
});