import { ApiError } from "../../common/errors/api-errors"
import { prisma } from "../../config/db"



export const getUserProfile = async (
    userId: string
) => {
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
    }
})

if(!user){
    throw new ApiError(404,'User not found');
}

return user;
}