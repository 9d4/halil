import { Context } from 'hono'
import { verifyJWTToken } from '../lib/auth/auth'
import { AppContext } from '../lib/context'

type Variables = {
    userId: string
    jwtClaims: ReturnType<typeof verifyJWTToken>
}

export type AppEnv = {
    Variables: Variables
}

/**
 * Create application context from Hono context
 */
export function context(c: Context): AppContext {
    const userId = c.get('userId') ?? null
    return {
        userId: typeof userId === 'string' ? userId : undefined,
    }
}
