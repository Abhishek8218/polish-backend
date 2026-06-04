import { FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "../common/errors/api-errors";
import * as jwt from "jsonwebtoken";
import { env } from "node:process";

type JwtPayload = {
  userId: string;
  email: string;
};

export const authMiddleware = async (
  request: FastifyRequest,
  _reply: FastifyReply,
) => {
  const authHeader = request.headers.authorization;
  if (!authHeader) {
    throw new ApiError(401, "Unauthorized access");
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Unauthorized access");
  }

  try {
    request.log.info(authHeader);
    request.log.info(token);
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
    request.log.info(decoded);
    request.user = decoded;
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }
};
