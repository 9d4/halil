import prisma from './lib/db'
import app from './router/index'

await prisma.$connect().catch((e) => {
    console.error('Failed to connect to the database:', e)
    process.exit(1)
})

const server = Bun.serve({
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
    fetch: app.fetch,
})

console.log(`Server running on :${server.port}`)
