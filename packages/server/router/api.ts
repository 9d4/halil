import { Hono } from 'hono'
import { createUser, listUsers } from '../lib/user/user'
import { UserLoginInput, UserRegisterInput } from '../lib/schema/user'
import { sValidator } from '@hono/standard-validator'
import { authenticate } from '../lib/auth/auth'
import { setAccessTokenCookie } from './cookie'
import { authenticated } from './middleware'
import { context } from './context'
import { createProject, updateProject } from '../lib/project/project'
import { CreateProjectInput, UpdateProjectInput } from '../lib/schema/project'

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

export type APIType = typeof api
export default api
