import { prisma } from './config/db';
import { env } from './config/env';

import { buildApp } from './app';

const start = async () => {
  try {
    const app = await buildApp();

    await prisma.$connect();

    app.log.info('Database connected');

    const port =
      Number(process.env.PORT) ||
      env.PORT;

    await app.listen({
      port,
      host: '0.0.0.0',
    });

    app.log.info(
      `Server running on port ${port}`
    );
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

start();