import OpenAI from 'openai';
import { ApiError } from "../../common/errors/api-errors";
import {
  consumeCredit,
  ensureCreditsAvailable,
} from "../../common/utils/billing";
import { prisma } from "../../config/db";
import { env } from "../../config/env";

import { PolishInput } from "./polish.schema";
import { buildFrameworkInstructions } from "./utils/build-framework-instructions";

// Initialize OpenRouter client
const openRouterClient = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: env.OPENAI_API_KEY, // Make sure this is set in your env
});

export const polishText = async (
  userId: string,
  payload: PolishInput,
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const framework = await prisma.framework.findFirst({
    where: {
      id: payload.frameworkId,
      userId,
    },
  });

  if (!framework) {
    throw new ApiError(404, "Framework not found");
  }

  await ensureCreditsAvailable(userId);
  console.log("3. Credits verified");

  const formalityLevel = framework.formalityLevel;
  const creativityLevel = framework.creativityLevel;
  const temperature = Number((formalityLevel / 100) + (creativityLevel / 100) / 2);

  const instructions = buildFrameworkInstructions(framework);

  try {
    console.log("6. Sending request to OpenRouter...");

    // First call - with reasoning enabled
    const apiResponse = await openRouterClient.chat.completions.create({
      model: 'openai/gpt-oss-120b:free', // or any other reasoning-capable model
      messages: [
        {
          role: "system",
          content: instructions,
        },
        {
          role: "user",
          content: payload.text,
        },
      ],
      temperature: temperature,
      max_tokens: 16384,
      top_p: 1.0,

    });

    // Type assertion to get reasoning_details
    type ORChatMessage = (typeof apiResponse)['choices'][number]['message'] & {
      reasoning_details?: unknown;
    };

    const response = apiResponse.choices[0].message as ORChatMessage;
    const polishedText = response.content?.trim();

    if (!polishedText) {
      console.error("No content returned from model");
      throw new ApiError(500, "Failed to generate polished text");
    }

    // Optional: You can also log reasoning if needed for debugging
    // console.log("Reasoning details:", response.reasoning_details);

    // Save history
    await prisma.polishHistory.create({
      data: {
        userId,
        frameworkId: framework.id,
        originalText: payload.text,
        polishedText,
      },
    });

    await consumeCredit(userId);

    console.log("History saved");
    console.log("Credit consumed");
    console.log("========== POLISH END ==========");

    return { polishedText };

  } catch (error: any) {
    console.error("========== POLISH ERROR ==========");
    console.error(error?.response?.data || error?.message || error);

    if (error?.status === 429 || error?.response?.status === 429) {
      throw new ApiError(429, "Rate limit exceeded. Please try again later.");
    }

    throw new ApiError(500, "Failed to process text");
  }
};