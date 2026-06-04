import { ApiError } from "../../common/errors/api-errors";
import { prisma } from "../../config/db";
import { CreateFrameworkInput, UpdateFrameworkInput } from "./framework.schema";

export const createFramework = async (
  userId: string,
  payload: CreateFrameworkInput,
) => {
  console.log("userId in creat frameowmr ", userId);
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      plan: true,
    },
  });
  console.log("user in creat frameowmr ", user);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const frameworkCount = await prisma.framework.count({
    where: {
      userId,
    },
  });

  if (user.plan === "FREE" && frameworkCount >= 3) {
    throw new ApiError(403, "Free plan allows maximum 3 frameworks");
  }

  const framework = await prisma.framework.create({
    data: {
      ...payload,
      userId,
    },
  });
  return framework;
};

const getFrameworkByIdAndUser = async (frameworkId: string, userId: string) => {
  const framework = await prisma.framework.findFirst({
    where: {
      id: frameworkId,
      userId,
    },
  });

  if (!framework) {
    throw new ApiError(404, "Framework not found");
  }

  return framework;
};

export const getAllFrameworks = async (
  userId: string,
  page = 1,
  limit = 10,
) => {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.framework.findMany({
      where: {
        userId,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.framework.count({
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



export const getFrameworkDetail =
  async (
    frameworkId: string,
    userId: string
  ) => {
    return getFrameworkByIdAndUser(
      frameworkId,
      userId
    );
  };


  export const updateFramework =
  async (
    frameworkId: string,
    userId: string,
    payload: UpdateFrameworkInput
  ) => {
    await getFrameworkByIdAndUser(
      frameworkId,
      userId
    );

    return prisma.framework.update({
      where: {
        id: frameworkId,
      },
      data: payload,
    });
  };



  export const deleteFramework =
  async (
    frameworkId: string,
    userId: string
  ) => {
    await getFrameworkByIdAndUser(
      frameworkId,
      userId
    );

    await prisma.framework.delete({
      where: {
        id: frameworkId,
      },
    });

    return null;
  };


  