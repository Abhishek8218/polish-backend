import { prisma } from './config/db';
import { env } from './config/env';

import { buildApp } from './app';

const start = async () => {
  try {
    const app = await buildApp();

    await prisma.$connect();

    app.log.info('Database connected');

    await app.listen({
      port: env.PORT,
      host: '0.0.0.0',
    });

    app.log.info(`Server running on port ${env.PORT}`);
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

start();