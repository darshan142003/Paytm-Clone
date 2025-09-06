import { PrismaClient } from '@prisma/client'


// Factory to create Prisma client
const createPrisma = () => {
  if (!process.env.DATABASE_URL) {
    console.warn('No DATABASE_URL found — returning build-safe stub Prisma client')

    // Proxy to intercept any Prisma queries
    const handler: ProxyHandler<any> = {
      get: (_, prop) => {
        return new Proxy(() => { }, {
          apply: (_, __, args) => {
            console.warn(`Prisma.${String(prop)} called, but DATABASE_URL not set. Skipping query.`)

            // Return realistic default values
            if (prop.toString().startsWith('findMany')) return Promise.resolve([])
            if (prop.toString().startsWith('findUnique')) return Promise.resolve(null)
            if (prop.toString().startsWith('create')) return Promise.resolve(args[0])
            if (prop.toString().startsWith('update')) return Promise.resolve(args[1])
            if (prop.toString().startsWith('delete')) return Promise.resolve(null)

            return Promise.resolve(null)
          }
        })
      }
    }

    return new Proxy({}, handler) as unknown as PrismaClient
  }

  // Normal Prisma client
  return new PrismaClient()
}

declare global {
  var prismaGlobal: PrismaClient | undefined
}

// Singleton pattern
const prisma: PrismaClient = globalThis.prismaGlobal ?? createPrisma()

if (process.env.NODE_ENV !== 'production' && process.env.DATABASE_URL) {
  globalThis.prismaGlobal = prisma
}

export default prisma
