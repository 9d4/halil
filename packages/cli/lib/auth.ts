import assert from 'assert'
import api from './api'
import config from './config'

export async function authLogin(login: string) {
    if (getSavedLogin().loggedIn) {
        return {
            success: false,
            message: `Already logged in as ${login}.`,
        }
    }

    const res = await api.auth.login.$post({
        json: { login },
    })
    if (res.status !== 200) {
        const json = (await res.json()) as unknown
        return {
            success: false,
            message: `Login failed: ${res.status} ${json.message}`,
        }
    }

    const json = await res.json()
    assert(typeof json.accessToken === 'string', 'No access token returned')
    config.set('accessToken', json.accessToken)
    config.set('login', login)

    return {
        success: true,
        message: `Logged in successfully as ${login}!`,
    }
}

export function getSavedLogin() {
    const accessToken = config.get('accessToken') as string | undefined
    const login = config.get('login') as string | undefined
    if (!accessToken || !login)
        return { loggedIn: false, login: null, accessToken: null }
    return { loggedIn: true, login, accessToken }
}
