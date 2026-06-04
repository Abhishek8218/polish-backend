import { FastifyReply } from 'fastify';

type ResponseOptions<T> = {
  statusCode: number;
  message: string;
  data?: T;
};

export const sendResponse = <T>(
  reply: FastifyReply,
  options: ResponseOptions<T>
) => {
  return reply.status(options.statusCode).send({
    success: true,
    message: options.message,
    data: options.data ?? null,
  });
};