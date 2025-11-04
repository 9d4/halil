import { hc } from 'hono/client'
import { APIType } from './api'

const createAPIClient = (baseURL: string) => {
    return hc<APIType>(baseURL)
}

export default createAPIClient
