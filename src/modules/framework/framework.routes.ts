import { FastifyInstance } from "fastify";

import {
  createFrameworkSchema,
  updateFrameworkSchema,
} from "./framework.schema";
import {
  createFrameworkController,
  deleteFrameworkController,
  getFrameworkDetailController,
  getFrameworksController,
  updateFrameworkController,
} from "./framework.controler";
import { validateRequest } from "../../middleware/validate-request";
import { authMiddleware } from "../../middleware/auth";

export const frameworkRoutes = async (app: FastifyInstance) => {
  app.post(
    "/",
    {
      preHandler: [authMiddleware, validateRequest(createFrameworkSchema)],
    },
    createFrameworkController,
  );

  //   get all Frameworks List API route
  app.get(
    "/",
    {
      preHandler: [authMiddleware],
    },
    getFrameworksController,
  );

  // get Framework by id
  app.get(
    "/:id",
    {
      preHandler: [authMiddleware],
    },
    getFrameworkDetailController,
  );

  app.patch(
    "/:id",
    {
      preHandler: [authMiddleware, validateRequest(updateFrameworkSchema)],
    },
    updateFrameworkController,
  );

  app.delete(
    "/:id",
    {
      preHandler: [authMiddleware],
    },
    deleteFrameworkController,
  );
};
