import { z } from "zod";

export const createFrameworkSchema = z.object({
  name: z.string().min(2).max(100),

  description: z.string().max(500).optional(),

  prompt: z.string().min(10).max(5000),

  tone: z.enum([
    "NEUTRAL",
    "PROFESSIONAL",
    "CASUAL",
    "FRIENDLY",
    "FORMAL",
    "CONVERSATIONAL",
    "ASSERTIVE",
    "EMPATHETIC",
  ]),

  formalityLevel: z.number().min(1).max(100),

  creativityLevel: z.number().min(1).max(100),

  lengthPreference: z.enum(["SHORTER", "ORIGINAL", "LONGER", "CONCISE", "ADD_MORE"]),

  preserveStyle: z.boolean(),

  enhanceClarity: z.boolean(),
});

export const updateFrameworkSchema = createFrameworkSchema.partial();

export type CreateFrameworkInput = z.infer<typeof createFrameworkSchema>;

export type UpdateFrameworkInput = z.infer<typeof updateFrameworkSchema>;
