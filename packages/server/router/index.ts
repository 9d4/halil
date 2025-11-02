import { Hono } from 'hono'
import apiRouter from './api'
import { errorHandler } from './error'
import { serveStatic } from 'hono/bun'
import config from '../config'

const app = new Hono()
app.route('/api', apiRouter)

app.get('/__info__', async (c) => {
    return c.json({
        bunVersion: Bun.version,
    })
})

const indexHtml = await Bun.file('./web/build/index.html').text()

app.get(
    '/*',
    serveStatic({
        root: './web/build',
        precompressed: !config.isDev,
    })
)

app.notFound(async (c) => {
    if (c.req.path.startsWith('/api')) {
        return c.json({ message: 'Resource not found' }, 404)
    }

    return c.html(indexHtml)
})
app.onError(errorHandler)

export default app
