import { FastifyReply, FastifyRequest } from "fastify";
import { getUserProfile } from "./user.service";
import { sendResponse } from "../../common/utils/send-response";




export const getUserProfileController = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
const user =  await getUserProfile(request.user.userId);
return sendResponse(reply, { statusCode: 201, message: "User profile", data: user });
};