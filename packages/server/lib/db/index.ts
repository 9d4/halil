import config from '../../config/index'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
    connectionString: config.databaseUrl,
    max: 10,
})
const prisma = new PrismaClient({ adapter })

export default prisma

// Extend BigInt prototype to support JSON serialization
;(BigInt.prototype as unknown as Record<string, unknown>).toJSON = function () {
    return this.toString()
}
