import { AppContext } from '../context'
import prisma from '../db'
import snowflake from '../db/snowflake'
import { AppError } from '../error/app'
import { CreateProjectInput, UpdateProjectInput } from '../schema/project'

export async function listProjects(ctx: AppContext) {
    const projects = await prisma.project.findMany({
        where: { userId: BigInt(ctx.userId!) },
        orderBy: { id: 'desc' },
    })
    return projects
}

export async function createProject(
    ctx: AppContext,
    input: CreateProjectInput
) {
    const project = await prisma.project.create({
        data: {
            id: snowflake.generateBigInt(),
            ...input,
            userId: BigInt(ctx.userId!),
        },
    })
    return project
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
