import type { AppContext } from '../context'
import prisma from '../db'
import snowflake from '../db/snowflake'
import { UpdateTodoItemsInput } from '../schema/project'

export async function updateTodoItems(
    ctx: AppContext,
    todoId: string,
    items: UpdateTodoItemsInput
) {
    const todo = await prisma.todo.findFirst({
        where: {
            project: { userId: BigInt(ctx.userId!) },
            id: BigInt(todoId),
        },
    })
    if (!todo) throw new Error('Todo not found')

    const txRes = await prisma.$transaction([
        prisma.todoItem.deleteMany({
            where: {
                todoId: BigInt(todoId),
                todo: { project: { userId: BigInt(ctx.userId!) } },
            },
        }),
        prisma.todoItem.createMany({
            data: items.map((item, i) => ({
                id: snowflake.generateBigInt(),
                todoId: todo.id,
                content: item.content,
                done: item.done,
                order: i,
            })),
        }),
        prisma.todoItem.findMany({
            where: {
                todoId: BigInt(todoId),
            },
            orderBy: { order: 'asc' },
        }),
    ])

    return { todo, items: txRes[2] }
}

export async function listTodoItems(ctx: AppContext, todoId: string) {
    const todoItems = await prisma.todoItem.findMany({
        where: {
            todoId: BigInt(todoId),
            todo: {
                project: { userId: BigInt(ctx.userId!) },
            },
        },
        orderBy: { order: 'asc' },
    })

    return todoItems
}
