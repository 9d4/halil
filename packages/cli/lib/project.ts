import {
    deriveKey,
    encryptContent,
    decryptContent,
} from 'halil/server/lib/crypto'
import config from './config'
import api from './api'

function cacheKey(projectId: string, key: CryptoKey) {
    return crypto.subtle.exportKey('jwk', key).then((jwk) => {
        config.set(`project:${projectId}:key`, jwk)
    })
}

async function getCachedKey(projectId: string): Promise<CryptoKey | null> {
    const jwk = config.get(`project:${projectId}:key`)
    if (!jwk) return null
    return crypto.subtle.importKey(
        'jwk',
        jwk as JsonWebKey,
        { name: 'AES-GCM', length: 256 },
        false,
        ['encrypt', 'decrypt']
    )
}

export async function unlockProject(
    projectId: string,
    phrase: string,
    salt: string
) {
    const key = await deriveKey(phrase, salt)
    await cacheKey(projectId, key)
    return key
}

export async function getProjectKey(
    projectId: string,
    phrase?: string,
    salt?: string
) {
    const cached = await getCachedKey(projectId)
    if (cached) return cached
    if (phrase && salt) return unlockProject(projectId, phrase, salt)
    return null
}

export async function listProjects() {
    const token = config.get('accessToken') as string | undefined
    const res = await api.projects.$get(
        {},
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    )
    return res.json()
}

export async function createProject(name: string, githubRepo: string) {
    const token = config.get('accessToken') as string | undefined
    const res = await api.projects.$post(
        {
            json: { name, githubRepo },
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    )
    return res.json()
}

export async function getProject(id: string) {
    const token = config.get('accessToken') as string | undefined
    const res = await api.projects[':projectId'].$get(
        {
            param: { projectId: id },
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    )
    return res.json()
}

export async function verifySeed(projectId: string, phrase: string) {
    const token = config.get('accessToken') as string | undefined
    const res = await api.projects[':projectId']['verify-seed'].$post(
        {
            param: { projectId },
            json: { phrase },
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    )
    return res.ok
}

export { encryptContent, decryptContent }
