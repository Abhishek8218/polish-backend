import { prisma } from "../../config/db";
import { ApiError } from "../errors/api-errors";
import { refreshCreditsIfNeeded } from "./refreshCredits";

export const consumeCredit = async (
  userId: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }

  const remainingCredits =
    user.creditsRemaining - 1;

  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      creditsRemaining: {
        decrement: 1,
      },

      ...(remainingCredits <= 0 && {
        creditsResetDate: new Date(
          Date.now() + 24 * 60 * 60 * 1000
        ),
      }),
    },
  });
};


 export const ensureCreditsAvailable = async (
  userId: string
) => {
  await refreshCreditsIfNeeded(userId);
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },

    select: {
      creditsRemaining: true,
      creditsResetDate: true,
    },
  });

  if (!user) {
    throw new ApiError(
      404,
      "User not found"
    );
  }

  const now = new Date();

  if (
    user.creditsRemaining <= 0 &&
    user.creditsResetDate &&
    user.creditsResetDate <= now
  ) {
    await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        creditsRemaining: 10,
        creditsResetDate: null,
      },
    });

    return true;
  }

  if (user.creditsRemaining <= 0) {
    throw new ApiError(
      403,
      "No credits remaining"
    );
  }

  return true;
};