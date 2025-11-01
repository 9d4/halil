import { Context } from 'hono'
import { getSignedCookie, setSignedCookie } from 'hono/cookie'
import config from '../config'

export const setAccessTokenCookie = (
    c: Context,
    token: string,
    expiredAt: Date
) => {
    return setSignedCookie(c, 'halil_token', token, config.appSecret!, {
        secure: !config.isDev,
        httpOnly: true,
        expires: expiredAt,
        maxAge: (expiredAt.getTime() - Date.now()) / 1000,
        sameSite: 'strict',
        prefix: config.isDev ? void 0 : 'host',
    })
}

export const getAccessTokenFromCookie = (c: Context) => {
    return getSignedCookie(c, config.appSecret, 'halil_token')
}
