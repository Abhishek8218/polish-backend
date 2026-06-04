
import * as jwt from 'jsonwebtoken';
import { env } from '../../config/env';

type JwtPayload = {
    userId:string;
    email:string;
}

export const generateAccessToken = (
    payload : JwtPayload
) => {
return jwt.sign(
    payload,
    env.JWT_ACCESS_SECRET,
    {
        expiresIn: '2d'
    }
)
}

export const generateRefreshToken = (
    payload : JwtPayload
) => {
    return jwt.sign(
        payload,
        env.JWT_REFRESH_SECRET,
        {
            expiresIn: '7d'
        }
    )
}