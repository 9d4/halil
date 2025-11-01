import { createMiddleware } from 'hono/factory'
import { getAccessTokenFromCookie } from './cookie'
import { AppError } from '../lib/error/app'
import { verifyJWTToken } from '../lib/auth/auth'
import { AppEnv } from './context'

export const authenticated = createMiddleware<AppEnv>(async (c, next) => {
    let token = c.req.header('Authorization') || ''
    if (!token) token = (await getAccessTokenFromCookie(c)) || ''
    if (!token) throw AppError.Unauthorized('Unauthorized')

    if (token.toLowerCase().startsWith('bearer ')) {
        token = token.split(' ')[1]!
        if (!token) throw AppError.Unauthorized('Unauthorized')
    }

    const claims = verifyJWTToken(token)
    if (!claims.sub) throw AppError.Unauthorized('Unauthorized')
    c.set('userId', claims.sub)
    c.set('jwtClaims', claims)

    return next()
})
