import { FastifyReply, FastifyRequest } from "fastify";
import { createFramework, deleteFramework, getAllFrameworks, getFrameworkDetail, updateFramework } from "./framework.service";
import { CreateFrameworkInput, UpdateFrameworkInput } from "./framework.schema";
import { sendResponse } from "../../common/utils/send-response";



export const createFrameworkController = async (
    request: FastifyRequest,
    reply: FastifyReply
) => {
const framework =  await createFramework(
    request.user.userId, request.body as CreateFrameworkInput
)
return sendResponse(reply, { statusCode: 201, message: "Framework created", data: framework });
}


export const getFrameworksController =
  async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const {
      page = '1',
      limit = '10',
    } = request.query as {
      page?: string;
      limit?: string;
    };

    const result =
      await getAllFrameworks(
        request.user.userId,
        Number(page),
        Number(limit)
      );

    return sendResponse(reply, {
      statusCode: 200,
      message:
        'Frameworks retrieved successfully',
      data: result,
    });
  };



  export const getFrameworkDetailController =
  async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { id } =
      request.params as {
        id: string;
      };

    const framework =
      await getFrameworkDetail(
        id,
        request.user.userId
      );

    return sendResponse(reply, {
      statusCode: 200,
      message:
        'Framework retrieved successfully',
      data: framework,
    });
  };
  



  export const updateFrameworkController =
  async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { id } =
      request.params as {
        id: string;
      };

    const framework =
      await updateFramework(
        id,
        request.user.userId,
        request.body as UpdateFrameworkInput
      );

    return sendResponse(reply, {
      statusCode: 200,
      message:
        'Framework updated successfully',
      data: framework,
    });
  };



  export const deleteFrameworkController =
  async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { id } =
      request.params as {
        id: string;
      };

    await deleteFramework(
      id,
      request.user.userId
    );

    return sendResponse(reply, {
      statusCode: 200,
      message:
        'Framework deleted successfully',
    });
  };