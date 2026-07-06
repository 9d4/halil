import snowflake from '../db/snowflake'
import z from 'zod'

export type UserRegisterInput = z.infer<typeof UserRegisterInput>
export const UserRegisterInput = z
    .object({
        login: z
            .string()
            .min(3)
            .max(30)
            .trim()
            .regex(/^[a-zA-Z0-9]+$/, {
                message: 'Login can only contain letters and numbers',
            }),
        name: z.string().optional(),
        password: z.string().min(6).max(100),
    })
    .transform((data) => {
        return {
            id: BigInt(snowflake.generate()),
            ...data,
        }
    })

export const UserLoginInput = z.object({
    login: z.string().max(30),
    password: z.string().min(1).max(100),
})
