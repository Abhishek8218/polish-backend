import { FastifyInstance } from "fastify";
import { authMiddleware } from "../../middleware/auth";
import { getUserProfileController } from "./user.controller";



export const userRoutes =  async (app: FastifyInstance) => {
    app.get(
        "/me",
        {
            preHandler: [authMiddleware],
        },
        getUserProfileController,
    );
};