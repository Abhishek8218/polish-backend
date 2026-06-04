import {
  FastifyReply,
  FastifyRequest,
} from 'fastify';

import { sendResponse } from '../../common/utils/send-response';

import {
  getHistoryList,
  getHistoryDetail,
  deleteHistory,
} from './polish-history.service';

export const getHistoryListController =
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
      await getHistoryList(
        request.user.userId,
        Number(page),
        Number(limit)
      );

    return sendResponse(reply, {
      statusCode: 200,
      message:
        'History retrieved successfully',
      data: result,
    });
  };



  export const getHistoryDetailController =
  async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { id } =
      request.params as {
        id: string;
      };

    const history =
      await getHistoryDetail(
        id,
        request.user.userId
      );

    return sendResponse(reply, {
      statusCode: 200,
      message:
        'History retrieved successfully',
      data: history,
    });
  };


  export const deleteHistoryController =
  async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const { id } =
      request.params as {
        id: string;
      };

    await deleteHistory(
      id,
      request.user.userId
    );

    return sendResponse(reply, {
      statusCode: 200,
      message:
        'History deleted successfully',
    });
  };