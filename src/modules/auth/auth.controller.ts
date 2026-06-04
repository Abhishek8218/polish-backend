import { FastifyReply, FastifyRequest } from "fastify";
import { loginSchema, RegisterInput, registerSchema, TLoginInput, TRefreshAccessTokenInput } from "./auth.schema";
import { loginUser, logoutUser, refreshAccessToken, registerUser } from "./auth.service";
import { success } from "zod";
import { sendResponse } from "../../common/utils/send-response";

export const registerController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const user = await registerUser(request.body as RegisterInput);

  return sendResponse(reply, { statusCode: 201, message: "User registered"});
};


export const loginController = async (
    request:FastifyRequest,
    reply:FastifyReply
) => {
const result =  await loginUser(request.body as TLoginInput);
return sendResponse(reply, { statusCode: 201, message: "User logged in", data: result });
}




// refresh Token Controller

export const refreshTokenController =
  async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const result =
      await refreshAccessToken(
        (
          request.body as TRefreshAccessTokenInput
        ).refreshToken
      );

    return sendResponse(reply, {
      statusCode: 200,
      message:
        'Token refreshed successfully',
      data: result,
    });
  };




//   Logout controller
export const logoutController =
  async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    await logoutUser(
      request.user.userId
    );

    return sendResponse(reply, {
      statusCode: 200,
      message:
        'Logged out successfully',
    });
  };