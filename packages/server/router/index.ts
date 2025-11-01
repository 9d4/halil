import { Hono } from 'hono'
import apiRouter from './api'
import { errorHandler } from './error'

const app = new Hono()
app.route('/api', apiRouter)

app.get('/__info__', async (c) => {
    return c.json({
        bunVersion: Bun.version,
    })
})

app.get('/*', async (c) => {
    return c.text('HTML content goes here')
})
app.onError(errorHandler)

export default app
