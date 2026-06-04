import { z } from 'zod';

export const polishSchema = z.object({
  frameworkId: z.uuid(),

  text: z
    .string()
    .min(10)
    .max(10000),
});

export type PolishInput =
  z.infer<typeof polishSchema>;