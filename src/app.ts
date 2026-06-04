import Fastify from 'fastify';

import { loggerConfig } from './config/logger';
import { registerRoutes } from './routes';
import { globalErrorHandler } from './common/errors/error-handler';
import { registerCors } from './plugins/cors';

export const buildApp = async  () => {
  const app = Fastify({
    logger: loggerConfig,
  });
app.setErrorHandler(globalErrorHandler);
await registerCors(app);
 await registerRoutes(app);


  return app;
};