import {
  FastifyReply,
  FastifyRequest,
} from 'fastify';

import { sendResponse } from '../../common/utils/send-response';

import { polishText } from './polish.service';

import { PolishInput } from './polish.schema';

export const polishController =
  async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const result =
      await polishText(
        request.user.userId,
        request.body as PolishInput
      );

    return sendResponse(reply, {
      statusCode: 200,
      message:
        'Text polished successfully',
      data: result,
    });
  };