import { FastifyInstance } from 'fastify';



import {
  polishSchema,
} from './polish.schema';

import {
  polishController,
} from './polish.controller';
import { authMiddleware } from '../../middleware/auth';
import { validateRequest } from '../../middleware/validate-request';
import { polishRateLimit } from '../../middleware/rate-limt-polish';

export const polishRoutes =
  async (
    app: FastifyInstance
  ) => {
    app.post(
      '/',
      {
        preHandler: [
          authMiddleware,
            polishRateLimit,
          validateRequest(
            polishSchema
          ),
        ],
      },

      polishController
    );
  };