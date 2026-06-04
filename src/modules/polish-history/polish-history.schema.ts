import { z } from 'zod';

export const historyListSchema =
  z.object({
    page: z.coerce.number().default(1),

    limit: z.coerce
      .number()
      .max(50)
      .default(10),
  });

export type HistoryListInput =
  z.infer<
    typeof historyListSchema
  >;