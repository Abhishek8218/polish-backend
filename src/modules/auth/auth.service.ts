import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken'
import { ApiError } from "../../common/errors/api-errors"
import { prisma } from "../../config/db"
import { RegisterInput, TLoginInput } from "./auth.schema"
import { generateAccessToken, generateRefreshToken } from '../../common/utils/jwt';
import { redis } from '../../config/redis';
import { REDIS_KEYS } from '../../common/constants/redis-keys';
import { env } from '../../config/env';


type JwtPayload = {
    userId : string,
    email : string
}

export const registerUser =  async (
    payload: RegisterInput
) => {
    const existingUser =  await prisma.user.findUnique({
        where: {
            email: payload.email,
        }
    })


    if(existingUser){
        throw new ApiError(409,'Email already exists');
    }

    const hashedPassword = await bcrypt.hash(
        payload.password,
        10
    )

    const user = await prisma.user.create({
        data:{
            fullName: payload.fullName,
            email: payload.email,
            password: hashedPassword
        }
    })
    return user
}



export const loginUser = async (
 payload :  TLoginInput
) => {
   const user = await prisma.user.findUnique({
       where : {
           email : payload.email
       }
   })
   if(!user){
       throw new ApiError(404,'User not found');
   }
   const isPasswordValid = await bcrypt.compare(payload.password,user.password)
   if(!isPasswordValid){
       throw new ApiError(401,'Invalid credentials');
   }

   const jwtPayload = {
       userId : user.id,
       email : user.email
   }

   const accessToken =  generateAccessToken(jwtPayload);
   const refreshToken = generateRefreshToken(jwtPayload);
 
    await redis.set(
        REDIS_KEYS.refreshToken(user.id),
        refreshToken,
        'EX',
        60 * 60 * 24 * 7
    )

   return {
       accessToken,
       refreshToken,
       user: {
           id : user.id,
           email : user.email,
           fullName : user.fullName,
           avatarUrl : user.avatarUrl,
           isEmailVerified : user.isEmailVerified,
           plan: user.plan
       }
   }
}



export const refreshAccessToken = async (refreshToken: string) => {
try {
  const decoded = jwt.verify(
    refreshToken,
    env.JWT_REFRESH_SECRET,
  );

  if (
    typeof decoded !== "object" ||
    !decoded ||
    !("userId" in decoded) ||
    !("email" in decoded)
  ) {
    throw new ApiError(
      401,
      "Invalid token payload",
    );
  }

    const storedToken =  await redis.get(
        REDIS_KEYS.refreshToken(decoded.userId)
    )

    if( ! storedToken || storedToken !== refreshToken){
        throw new ApiError(401,'Unauthorized access');
    }

    const accessToken =  generateAccessToken({
        userId : decoded.userId,
        email : decoded.email
    })
    return {
        accessToken
    };
} catch (error) {
    throw new ApiError(401,'Unauthorized access');

}
}




// Logout 

export const logoutUser =
  async (userId: string) => {
    await redis.del(
      REDIS_KEYS.refreshToken(userId)
    );

    return null;
  };