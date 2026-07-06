import prisma from '../db'
import { parseDuplicateError } from '../db/error'
import { AppError } from '../error/app'
import { UserRegisterInput } from '../schema/user'

export async function createUser(input: UserRegisterInput) {
    try {
        const { password, ...rest } = input
        const passwordHash = await Bun.password.hash(password)
        const user = await prisma.user.create({
            data: { ...rest, passwordHash },
        })
        return user
    } catch (e) {
        const dup = parseDuplicateError(e)
        if (dup)
            throw AppError.Conflict('User already exists', { cause: dup.error })
        throw e
    }
}

export async function listUsers() {
    const users = await prisma.user.findMany({})
    return users
}
