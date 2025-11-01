import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'

export function parseDuplicateError(error: unknown) {
    if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            return { error: error }
        }
    }
    return null
}
