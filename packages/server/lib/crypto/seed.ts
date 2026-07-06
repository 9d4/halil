import words from './wordlist'

export function generateSeedPhrase(length = 6) {
    const phrase: string[] = []
    for (let i = 0; i < length; i++) {
        const idx = Math.floor(Math.random() * words.length)
        phrase.push(words[idx]!)
    }
    return phrase.join(' ')
}

export async function hashSeedPhrase(phrase: string, salt: string) {
    const data = new TextEncoder().encode(phrase + salt)
    const hash = await crypto.subtle.digest('SHA-256', data)
    const hex = Array.from(new Uint8Array(hash))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')
    return hex
}

export async function deriveKey(phrase: string, salt: string) {
    const keyMaterial = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(phrase),
        'PBKDF2',
        false,
        ['deriveKey']
    )

    // ponytail: extractable=true is required to cache the key in localStorage.
    // Storing the key (not the seed phrase) was the requested UX.
    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: new TextEncoder().encode(salt),
            iterations: 600000,
            hash: 'SHA-256',
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
    )
}
