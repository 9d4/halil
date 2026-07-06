import api from '$lib/api'
import { getCachedKey } from '$lib/crypto'
import { redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const ssr = false

export const load: PageLoad = async ({ params, fetch }) => {
    const projectRes = await api.projects[':projectId'].$get(
        { param: { projectId: params.projectId } },
        { fetch }
    )
    if (projectRes.status === 401) redirect(302, '/login')
    const project = await projectRes.json()

    const todosRes = await api.projects[':projectId'].todos.$get(
        { param: { projectId: params.projectId } },
        { fetch }
    )
    const todos = await todosRes.json()

    const hasKey = !!(await getCachedKey(params.projectId))

    return { project, todos, hasKey }
}
