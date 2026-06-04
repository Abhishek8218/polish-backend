import { FastifyReply, FastifyRequest } from 'fastify';

import { Prisma } from '@prisma/client';

import { ApiError } from './api-errors';
import { ZodError } from 'zod';

export const globalErrorHandler = (
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) => {
  request.log.error(error);

  // Custom API Errors
  if (error instanceof ApiError) {
    return reply.status(error.statusCode).send({
      success: false,
      message: error.message,
      errors: error.errors ?? null,
    });
  }

  if (error instanceof ZodError) {
  return reply.status(400).send({
    success: false,
    message: 'Validation failed',
    errors: error.flatten().fieldErrors,
  });
}

  // Prisma Errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return reply.status(400).send({
      success: false,
      message: 'Database operation failed',
      errors: error.message,
    });
  }

  // Default Error
  return reply.status(500).send({
    success: false,
    message: 'Internal server error',
    errors: null,
  });
};