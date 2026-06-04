import { ApiError } from '../../common/errors/api-errors';
import { prisma } from '../../config/db';


export const getHistoryByIdAndUser =
  async (
    historyId: string,
    userId: string
  ) => {
    const history =
      await prisma.polishHistory.findFirst({
        where: {
          id: historyId,
          userId,
        },

        include: {
          framework: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

    if (!history) {
      throw new ApiError(
        404,
        'History not found'
      );
    }

    return history;
  };


  export const getHistoryList =
  async (
    userId: string,
    page = 1,
    limit = 10
  ) => {
    const skip =
      (page - 1) * limit;

    const [items, total] =
      await Promise.all([
        prisma.polishHistory.findMany({
          where: {
            userId,
          },

          include: {
            framework: {
              select: {
                id: true,
                name: true,
              },
            },
          },

          orderBy: {
            createdAt: 'desc',
          },

          skip,
          take: limit,
        }),

        prisma.polishHistory.count({
          where: {
            userId,
          },
        }),
      ]);

    return {
      items,
      total,
      page,
      limit,
    };
  };


  export const getHistoryDetail =
  async (
    historyId: string,
    userId: string
  ) => {
    return getHistoryByIdAndUser(
      historyId,
      userId
    );
  };


  export const deleteHistory =
  async (
    historyId: string,
    userId: string
  ) => {
    await getHistoryByIdAndUser(
      historyId,
      userId
    );

    await prisma.polishHistory.delete({
      where: {
        id: historyId,
      },
    });

    return null;
  };