import z from 'zod'

// - convert url of github repo to pattern owner/repo
// - support directly owner/repo input
const GitHubRepoSchema = z.string().refine(
    (val) => {
        const githubUrlPattern =
            //eslint-disable-next-line no-useless-escape
            /^https?:\/\/(www\.)?github\.com\/([^\/]+)\/([^\/]+)(\/)?$/
        //eslint-disable-next-line no-useless-escape
        const ownerRepoPattern = /^[^\/]+\/[^\/]+$/

        return githubUrlPattern.test(val) || ownerRepoPattern.test(val)
    },
    { error: 'Invalid GitHub repository format' }
)

export type CreateProjectInput = z.infer<typeof CreateProjectInput>
export const CreateProjectInput = z.object({
    name: z.string().min(1).max(100),
    description: z.string().max(500).optional(),
    githubRepo: GitHubRepoSchema,
})

export type UpdateProjectInput = z.infer<typeof UpdateProjectInput>
export const UpdateProjectInput = CreateProjectInput.partial()

export type CreateTodoInput = z.infer<typeof CreateTodoInput>
export const CreateTodoInput = z.object({
    name: z.string().min(1).max(200),
})

export type UpdateTodoInput = z.infer<typeof UpdateTodoInput>
export const UpdateTodoInput = CreateTodoInput.partial()
