// import { ApiError } from "../../common/errors/api-errors";
// import {
//   consumeCredit,
//   ensureCreditsAvailable,
// } from "../../common/utils/billing";
// import { prisma } from "../../config/db";
// import { openai } from "../../config/openai";

// import { PolishInput } from "./polish.schema";

// import { buildFrameworkInstructions } from "./utils/build-framework-instructions";

// export const polishText = async (userId: string, payload: PolishInput) => {
//   const user = await prisma.user.findUnique({
//     where: {
//       id: userId,
//     },
//   });

//   if (!user) {
//     throw new ApiError(404, "User not found");
//   }

//   if (user.creditsRemaining <= 0) {
//     throw new ApiError(403, "No credits remaining");
//   }

//   const framework = await prisma.framework.findFirst({
//     where: {
//       id: payload.frameworkId,
//       userId,
//     },
//   });

//   if (!framework) {
//     throw new ApiError(404, "Framework not found");
//   }

//   const instructions = buildFrameworkInstructions(framework);

//   await ensureCreditsAvailable(userId);

//   const response = await openai.responses.create({
//     model: "openai/gpt-oss-120b",

//     instructions,

//     input: payload.text,
//   });

//   const polishedText = response.output_text;

//   await prisma.polishHistory.create({
//     data: {
//       userId,

//       frameworkId: framework.id,

//       originalText: payload.text,

//       polishedText,
//     },
//   });

//   await consumeCredit(userId);

//   return {
//     polishedText,
//   };
// };

import { ApiError } from "../../common/errors/api-errors";
import {
  consumeCredit,
  ensureCreditsAvailable,
} from "../../common/utils/billing";
import { prisma } from "../../config/db";

import OpenAI from 'openai';
import { PolishInput } from "./polish.schema";
import { buildFrameworkInstructions } from "./utils/build-framework-instructions";
import { env } from "../../config/env";

// Initialize NVIDIA OpenAI-compatible client
const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
});

export const polishText = async (userId: string, payload: PolishInput) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.creditsRemaining <= 0) {
    throw new ApiError(403, "No credits remaining");
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

  const instructions = buildFrameworkInstructions(framework);

  await ensureCreditsAvailable(userId);

  // Updated call using chat.completions.create for NVIDIA
  const completion = await openai.chat.completions.create({
    model: "openai/gpt-oss-120b",
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
    temperature: 1,
    top_p: 1,
    max_tokens: 4096,
    stream: false,
  });


  const polishedText = completion.choices[0]?.message?.content?.trim();

  if (!polishedText) {
    throw new ApiError(500, "Failed to generate polished text");
  }

  await prisma.polishHistory.create({
    data: {
      userId,
      frameworkId: framework.id,
      originalText: payload.text,
      polishedText,
    },
  });

  await consumeCredit(userId);

  return {
    polishedText,
  };
};