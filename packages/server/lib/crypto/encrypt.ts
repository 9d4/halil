function bufferToBase64(buf: ArrayBuffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buf)))
}

function base64ToBuffer(str: string) {
    return Uint8Array.from(atob(str), (c) => c.charCodeAt(0)).buffer
}

export async function encryptContent(
    plaintext: string,
    key: CryptoKey
): Promise<string> {
    const nonce = crypto.getRandomValues(new Uint8Array(12))
    const encoded = new TextEncoder().encode(plaintext)
    const encrypted = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: nonce },
        key,
        encoded
    )
    const combined = new Uint8Array(nonce.length + encrypted.byteLength)
    combined.set(nonce)
    combined.set(new Uint8Array(encrypted), nonce.length)
    return bufferToBase64(combined.buffer)
}

export async function decryptContent(
    encoded: string,
    key: CryptoKey
): Promise<string> {
    const buf = base64ToBuffer(encoded)
    const nonce = new Uint8Array(buf.slice(0, 12))
    const ciphertext = buf.slice(12)
    const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: nonce },
        key,
        ciphertext
    )
    return new TextDecoder().decode(decrypted)
}
