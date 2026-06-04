// src/plugins/cors.ts

import { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';

export const registerCors = async (app: FastifyInstance) => {
  await app.register(cors, {
    origin: ['https://polishai.vercel.app'],
    
    credentials: true,                    // Important for cookies/auth
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Requested-With',
      'Accept',
      'Origin',
    ],
    
    exposedHeaders: ['Content-Length', 'X-Request-ID'],
    
    // Optional but recommended
    preflightContinue: false,
    optionsSuccessStatus: 204,   // Some browsers expect 204 for preflight
  });
};