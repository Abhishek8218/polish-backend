import { FastifyInstance } from 'fastify';

import {
  getHistoryListController,
  getHistoryDetailController,
  deleteHistoryController,
} from './polish-history.controller';
import { authMiddleware } from '../../middleware/auth';

export const polishHistoryRoutes =
  async (
    app: FastifyInstance
  ) => {
    app.get(
      '/',
      {
        preHandler: [authMiddleware],
      },
      getHistoryListController
    );

    app.get(
      '/:id',
      {
        preHandler: [authMiddleware],
      },
      getHistoryDetailController
    );

    app.delete(
      '/:id',
      {
        preHandler: [authMiddleware],
      },
      deleteHistoryController
    );
  };