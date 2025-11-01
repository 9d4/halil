import { ErrorHandler } from 'hono'
import { AppError, AppErrorKindToStatusCode } from '../lib/error/app'
import config from '../config'
import { ContentfulStatusCode } from 'hono/utils/http-status'

export const errorHandler: ErrorHandler = (err, c) => {
    if (config.isDev) console.error('Handling error: ', err)

    if (err instanceof AppError) {
        const kind = err.getKind()
        const code = AppErrorKindToStatusCode[kind] || 500
        return c.json(err.toJSON(), code as ContentfulStatusCode)
    }

    if (err instanceof SyntaxError) {
        return c.json(
            { message: 'Please check your request before trying again' },
            400
        )
    }

    console.error('Unhandled error occurred:', err)
    return c.json({ message: 'An unexpected error occurred' }, 500)
}
