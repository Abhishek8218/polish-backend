import { FastifyReply, FastifyRequest } from "fastify";
import { ApiError } from "../common/errors/api-errors";
import * as jwt from "jsonwebtoken";
import { env } from "../config/env";

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
  const decoded = jwt.verify(
    token,
    env.JWT_ACCESS_SECRET,
  );

  if (
    typeof decoded !== "object" ||
    !decoded ||
    !("userId" in decoded) ||
    !("email" in decoded)
  ) {
    throw new ApiError(
      401,
      "Invalid token payload",
    );
  }

  request.user = {
    userId: decoded.userId as string,
    email: decoded.email as string,
  };
} catch {
  throw new ApiError(
    401,
    "Invalid or expired token",
  );
}
};
