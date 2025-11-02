import api from '$lib/api'
import { redirect } from '@sveltejs/kit'
import type { PageLoad } from './$types'

export const ssr = false

export const load: PageLoad = async ({ fetch }) => {
    const res = await api.projects.$get({}, { fetch })
    if (res.status === 401) redirect(302, '/login')

    const json = await res.json()
    return {
        projects: json,
    }
}
