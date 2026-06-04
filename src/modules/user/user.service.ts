import { ApiError } from "../../common/errors/api-errors"
import { refreshCreditsIfNeeded } from "../../common/utils/refreshCredits";
import { prisma } from "../../config/db"



export const getUserProfile = async (
    userId: string
) => {
await refreshCreditsIfNeeded(userId);
const user  =  await prisma.user.findUnique({
    where : {
        id : userId
    },
    select: {
        id: true,
      email: true,
      fullName: true,
      avatarUrl: true,
      plan: true,
      creditsRemaining: true,
      isEmailVerified: true,
      createdAt: true,
      creditsResetDate: true
    }
})

if(!user){
    throw new ApiError(404,'User not found');
}

return user;
}