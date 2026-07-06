import {
    deriveKey,
    encryptContent,
    decryptContent,
} from 'halil/server/lib/crypto'

const CACHE_PREFIX = 'halil:proj:'

function getCacheKey(projectId: string) {
    return `${CACHE_PREFIX}${projectId}:key`
}

export async function getCachedKey(
    projectId: string
): Promise<CryptoKey | null> {
    const raw = localStorage.getItem(getCacheKey(projectId))
    if (!raw) return null
    try {
        const jwk = JSON.parse(raw) as JsonWebKey
        return await crypto.subtle.importKey(
            'jwk',
            jwk,
            { name: 'AES-GCM', length: 256 },
            false,
            ['encrypt', 'decrypt']
        )
    } catch {
        localStorage.removeItem(getCacheKey(projectId))
        return null
    }
}

async function cacheKey(projectId: string, key: CryptoKey) {
    const jwk = await crypto.subtle.exportKey('jwk', key)
    localStorage.setItem(getCacheKey(projectId), JSON.stringify(jwk))
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

export { encryptContent, decryptContent, deriveKey }
