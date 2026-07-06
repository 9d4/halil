import type { AppContext } from '../context'
import prisma from '../db'
import snowflake from '../db/snowflake'
import { AppError } from '../error/app'
import { generateSeedPhrase, hashSeedPhrase } from '../crypto'
import {
    CreateProjectInput,
    CreateTodoInput,
    UpdateProjectInput,
    UpdateTodoInput,
} from '../schema/project'

export async function listProjects(ctx: AppContext) {
    const projects = await prisma.project.findMany({
        where: { userId: BigInt(ctx.userId!) },
        orderBy: { id: 'desc' },
    })
    return projects
}

export async function getProject(ctx: AppContext, projectId: string) {
    const project = await prisma.project.findFirst({
        where: { id: BigInt(projectId), userId: BigInt(ctx.userId!) },
    })
    if (!project) throw AppError.NotFound('Project not found')
    return project
}

export async function createProject(
    ctx: AppContext,
    input: CreateProjectInput
) {
    const seedPhrase = generateSeedPhrase()
    const salt = crypto.randomUUID()
    const seedHash = await hashSeedPhrase(seedPhrase, salt)

    const project = await prisma.project.create({
        data: {
            id: snowflake.generateBigInt(),
            ...input,
            userId: BigInt(ctx.userId!),
            seedPhraseHash: seedHash,
            seedPhraseSalt: salt,
        },
    })
    return { ...project, seedPhrase }
}

export async function verifySeedPhrase(projectId: string, phrase: string) {
    const project = await prisma.project.findFirst({
        where: { id: BigInt(projectId) },
    })
    if (!project) throw AppError.NotFound('Project not found')
    if (!project.seedPhraseHash || !project.seedPhraseSalt)
        throw AppError.BadRequest('Project has no encryption')
    const hash = await hashSeedPhrase(phrase, project.seedPhraseSalt)
    if (hash !== project.seedPhraseHash)
        throw AppError.Unauthorized('Invalid seed phrase')
    return true
}

export async function updateProject(
    ctx: AppContext,
    projectId: string,
    patch: UpdateProjectInput
) {
    const project = await prisma.project.update({
        where: { id: BigInt(projectId), userId: BigInt(ctx.userId!) },
        data: patch,
    })
    if (!project) throw AppError.NotFound('Project not found')
    return project
}

export async function deleteProject(ctx: AppContext, projectId: string) {
    const project = await prisma.project.delete({
        where: { id: BigInt(projectId), userId: BigInt(ctx.userId!) },
    })
    if (!project) throw AppError.NotFound('Project not found')
    return project
}

export async function listProjectTodos(ctx: AppContext, projectId: string) {
    const todos = await prisma.todo.findMany({
        where: {
            projectId: BigInt(projectId),
            project: { userId: BigInt(ctx.userId!) },
        },
        orderBy: { id: 'desc' },
    })
    return todos
}

export async function getProjectTodo(
    ctx: AppContext,
    projectId: string,
    todoId: string
) {
    const todo = await prisma.todo.findFirst({
        where: {
            id: BigInt(todoId),
            projectId: BigInt(projectId),
            project: { userId: BigInt(ctx.userId!) },
        },
        include: { project: true },
    })
    if (!todo) throw AppError.NotFound('Todo not found')
    return todo
}

export async function createProjectTodo(
    ctx: AppContext,
    projectId: string,
    input: CreateTodoInput
) {
    const project = await getProject(ctx, projectId)
    const todo = await prisma.todo.create({
        data: {
            id: snowflake.generateBigInt(),
            name: input.name,
            projectId: project.id,
        },
        include: { project: true },
    })
    return todo
}

export async function updateProjectTodo(
    ctx: AppContext,
    projectId: string,
    todoId: string,
    update: UpdateTodoInput
) {
    const todo = await prisma.todo.update({
        where: {
            id: BigInt(todoId),
            project: { id: BigInt(projectId), userId: BigInt(ctx.userId!) },
        },
        data: update,
    })
    if (!todo) throw AppError.NotFound('Todo not found')
    return todo
}

export async function deleteProjectTodo(
    ctx: AppContext,
    projectId: string,
    todoId: string
) {
    const todo = await prisma.todo.delete({
        where: {
            id: BigInt(todoId),
            project: { id: BigInt(projectId), userId: BigInt(ctx.userId!) },
        },
    })
    if (!todo) throw AppError.NotFound('Todo not found')
    return todo
}
