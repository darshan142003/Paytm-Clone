import { PrismaClient } from '@prisma/client'

// Recursive stub factory for Prisma client
const createStub = (): any => {
  const handler: ProxyHandler<any> = {
    get: (_, prop) => new Proxy(() => { }, {
      get: () => createStub(), // Recursively return stub for nested properties
      apply: (_, __, args) => {
        console.warn(`Prisma.${String(prop)} called, skipping DB query.`)

        // Return realistic default values
        if (prop === 'create') return Promise.resolve(args[0])
        if (prop === 'findUnique') return Promise.resolve(null)
        if (prop === 'findMany') return Promise.resolve([])
        if (prop === 'update') return Promise.resolve(args[1])
        if (prop === 'delete') return Promise.resolve(null)
        return Promise.resolve(null)
      }
    })
  }
  return new Proxy({}, handler)
}

// Factory to create Prisma client
const createPrisma = () => {
  if (!process.env.DATABASE_URL) {
    console.warn('No DATABASE_URL found — returning build-safe stub Prisma client')
    return createStub() as unknown as PrismaClient
  }

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
