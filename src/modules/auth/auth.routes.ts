import { FastifyInstance } from "fastify";
import { loginController, logoutController, refreshTokenController, registerController } from "./auth.controller";
import { validateRequest } from "../../middleware/validate-request";
import { loginSchema, refreshAccessTokenSchema, registerSchema } from "./auth.schema";
import { authMiddleware } from "../../middleware/auth";

export const authRoutes = async (app: FastifyInstance) => {
  app.post(
    "/register",
    {
      preHandler: [validateRequest(registerSchema)],
    },
    registerController,
  );
  app.post(
    "/login",
    {
      preHandler: [validateRequest(loginSchema)],
    },
    loginController,
  );

  app.post(
  '/refresh-token',
  {
    preHandler: [
      validateRequest(
        refreshAccessTokenSchema
      ),
    ],
  },
  refreshTokenController
);

app.post(
  '/logout',
  {
    preHandler: [authMiddleware],
  },
  logoutController
);
};
