import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'

export function parseDuplicateError(error: any) {
    if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
            const target = (error.meta && (error.meta.target as string[])) || []
            return { error: error }
        }
    }
    return null
}
