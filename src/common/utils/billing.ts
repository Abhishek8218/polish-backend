import { prisma } from "../../config/db";
import { ApiError } from "../errors/api-errors";

export const consumeCredit =
  async (userId: string) => {
    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

    if (!user) {
      throw new ApiError(
        404,
        'User not found'
      );
    }

    if (
      user.creditsRemaining <= 0
    ) {
      throw new ApiError(
        403,
        'No credits remaining'
      );
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        creditsRemaining: {
          decrement: 1,
        },
      },
    });
  };


  export const ensureCreditsAvailable =
  async (
    userId: string
  ) => {
    const user =
      await prisma.user.findUnique({
        where: {
          id: userId,
        },

        select: {
          creditsRemaining: true,
        },
      });

    if (!user) {
      throw new ApiError(
        404,
        'User not found'
      );
    }

    if (
      user.creditsRemaining <= 0
    ) {
      throw new ApiError(
        403,
        'No credits remaining'
      );
    }

    return true;
  };