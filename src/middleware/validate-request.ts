import { FastifyRequest } from 'fastify';
import { z } from 'zod';

export const validateRequest =
  (schema: z.ZodObject<any>) =>
  async (request: FastifyRequest) => {
    const result = schema.safeParse(request.body);

    if (!result.success) {
      throw result.error;
    }

    request.body = result.data;
  };