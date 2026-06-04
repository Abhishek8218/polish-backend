
import { prisma } from '../../config/db';
export const refreshCreditsIfNeeded = async (
  userId: string
) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!user) {
    return;
  }

  if (
    user.creditsRemaining <= 0 &&
    user.creditsResetDate &&
    user.creditsResetDate <= new Date()
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
  }
};