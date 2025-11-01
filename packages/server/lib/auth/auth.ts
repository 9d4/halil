import jwt from 'jsonwebtoken'
import prisma from '../db'
import { AppError } from '../error/app'
import config from '../../config'
import ms from 'ms'

const JWT_TOKEN_ISS = 'halil'

export async function authenticate(login: string) {
    const user = await prisma.user.findFirst({
        where: { login },
    })
    if (!user) throw AppError.NotFound('User not found')
    const token = createJWTToken(user.id.toString())
    return { token, user }
}

export function createJWTToken(userId: string) {
    if (!config.appSecret) throw new Error('JWT_SECRET is not defined')

    const token = jwt.sign({}, config.appSecret, {
        subject: userId,
        expiresIn: config.jwtExpiresIn as ms.StringValue,
        issuer: JWT_TOKEN_ISS,
    })

    const expiration = ms(config.jwtExpiresIn as ms.StringValue)
    return { token, expiredAt: new Date(Date.now() + expiration) }
}

export function verifyJWTToken(token: string) {
    if (!config.appSecret) throw new Error('JWT_SECRET is not defined')

    try {
        const decoded = jwt.verify(token, config.appSecret, {
            issuer: JWT_TOKEN_ISS,
        }) as { sub: string; iat: number; exp: number; iss: string }
        return decoded
    } catch (err) {
        throw AppError.Unauthorized('Invalid token', { cause: err })
    }
}
