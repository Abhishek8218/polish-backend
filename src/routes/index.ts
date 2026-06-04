import { FastifyInstance } from "fastify";
import { ApiError } from "../common/errors/api-errors";
import { authRoutes } from "../modules/auth/auth.routes";
import { authMiddleware } from "../middleware/auth";
import { userRoutes } from "../modules/user/user.routes";
import { frameworkRoutes } from "../modules/framework/framework.routes";
import { polishHistoryRoutes } from "../modules/polish-history/polish-history.routes";
import { polishRoutes } from "../modules/polish/polish.route";
export const registerRoutes = async (app: FastifyInstance) => {
  app.get("/health", async () => {
    return {
      success: true,
    };
  });

  //   authRoutes
  await app.register(authRoutes, {
    prefix: "/api/v1/auth",
  });


// user routes

await app.register(userRoutes,{
    prefix: '/api/v1/users'
})


await app.register(
  frameworkRoutes,
  {
    prefix:
      '/api/v1/frameworks',
  }
);


await app.register(
  polishHistoryRoutes,
  {
    prefix:
      '/api/v1/polish-history',
  }
);



await app.register(
  polishRoutes,
  {
    prefix: '/api/v1/polish',
  }
);
};
