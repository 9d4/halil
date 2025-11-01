import { Hono } from 'hono'
import { createUser, listUsers } from '../lib/user/user'
import { UserLoginInput, UserRegisterInput } from '../lib/schema/user'
import { sValidator } from '@hono/standard-validator'
import { authenticate } from '../lib/auth/auth'
import { setAccessTokenCookie } from './cookie'
import { authenticated } from './middleware'
import { context } from './context'
import {
    createProject,
    createProjectTodo,
    deleteProject,
    deleteProjectTodo,
    getProjectTodo,
    listProjects,
    listProjectTodos,
    updateProject,
    updateProjectTodo,
} from '../lib/project/project'
import {
    CreateProjectInput,
    CreateTodoInput,
    UpdateProjectInput,
    UpdateTodoInput,
} from '../lib/schema/project'
import z from 'zod'

const api = new Hono()

    // Ping
    .get('/ping', async (c) => c.text('API OK'))

    // Authenticate
    .post('/auth/login', sValidator('json', UserLoginInput), async (c) => {
        const { login } = c.req.valid('json')
        const { token } = await authenticate(login)
        await setAccessTokenCookie(c, token.token, token.expiredAt)
        return c.json({ accessToken: token.token })
    })

    // Signup
    .post('/auth/signup', sValidator('json', UserRegisterInput), async (c) => {
        const body = c.req.valid('json')
        const res = await createUser(body)
        return c.json(res)
    })

    .get('/auth/claims', authenticated, async (c) => {
        const claims = c.get('jwtClaims')
        return c.json(claims)
    })

    // List users
    .get('/users', async (c) => {
        const users = await listUsers()
        return c.json(users)
    })

    // =============================================
    // Routes: Projects
    // =============================================

    // List projects
    .get('/projects', authenticated, async (c) => {
        const ctx = context(c)
        const projects = await listProjects(ctx)
        return c.json(projects)
    })

    // Create a new project
    .post(
        '/projects',
        authenticated,
        sValidator('json', CreateProjectInput),
        async (c) => {
            const ctx = context(c)
            const body = c.req.valid('json')
            const proj = await createProject(ctx, body)
            return c.json(proj, 201)
        }
    )

    // Update a project
    .patch(
        '/projects/:projectId',
        authenticated,
        sValidator('json', UpdateProjectInput),
        async (c) => {
            const ctx = context(c)
            const projectId = c.req.param('projectId')
            const body = c.req.valid('json')
            const updated = await updateProject(ctx, projectId, body)
            return c.json(updated)
        }
    )

    // Delete a project
    .delete('/projects/:projectId', authenticated, async (c) => {
        const ctx = context(c)
        const projectId = c.req.param('projectId')
        await deleteProject(ctx, projectId)
        return c.body(null, 204)
    })

    // =============================================
    // Routes: Project's Todos
    // =============================================

    // List todos of a project
    .get(
        '/projects/:projectId/todos',
        authenticated,
        sValidator('param', z.object({ projectId: z.string() })),
        async (c) => {
            const ctx = context(c)
            const { projectId } = c.req.valid('param')
            const todos = await listProjectTodos(ctx, projectId)
            return c.json(todos)
        }
    )

    // Get todo details
    .get(
        '/projects/:projectId/todos/:todoId',
        authenticated,
        sValidator(
            'param',
            z.object({ projectId: z.string(), todoId: z.string() })
        ),
        async (c) => {
            const ctx = context(c)
            const { projectId, todoId } = c.req.valid('param')
            const todo = await getProjectTodo(ctx, projectId, todoId)
            return c.json(todo)
        }
    )

    // Create new todo
    .post(
        '/projects/:projectId/todos',
        authenticated,
        sValidator('param', z.object({ projectId: z.string() })),
        sValidator('json', CreateTodoInput),
        async (c) => {
            const ctx = context(c)
            const { projectId } = c.req.valid('param')
            const body = c.req.valid('json')
            const todo = await createProjectTodo(ctx, projectId, body)
            return c.json(todo, 201)
        }
    )

    // Update todo
    .patch(
        '/projects/:projectId/todos/:todoId',
        authenticated,
        sValidator(
            'param',
            z.object({ projectId: z.string(), todoId: z.string() })
        ),
        sValidator('json', UpdateTodoInput),
        async (c) => {
            const ctx = context(c)
            const { projectId, todoId } = c.req.valid('param')
            const body = c.req.valid('json')
            const todo = await updateProjectTodo(ctx, projectId, todoId, body)
            return c.json(todo)
        }
    )

    // Delete todo
    .delete(
        '/projects/:projectId/todos/:todoId',
        authenticated,
        sValidator(
            'param',
            z.object({ projectId: z.string(), todoId: z.string() })
        ),
        async (c) => {
            const ctx = context(c)
            const { projectId, todoId } = c.req.valid('param')
            await deleteProjectTodo(ctx, projectId, todoId)
            return c.body(null, 204)
        }
    )

export type APIType = typeof api
export default api
