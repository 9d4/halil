import { hc } from 'hono/client'
import type { APIType } from 'halil/server/router/api.ts'

const api = hc<APIType>('/api')
export default api
