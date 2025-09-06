import { PrismaClient } from '@prisma/client'

// Recursive stub handler for Prisma during build/CI
const createPrismaStub = (): any => {
  const handler: ProxyHandler<any> = {
    get: (_, prop) => {
      return new Proxy(() => { }, {
        get: () => createPrismaStub(), // nested model access like prisma.merchant.findMany
        apply: (_, __, args) => {
          console.warn(`Prisma.${String(prop)} called — skipping DB query.`)
          if (prop.toString().startsWith('create')) return Promise.resolve(args[0])
          if (prop.toString().startsWith('findUnique')) return Promise.resolve(null)
          if (prop.toString().startsWith('findMany')) return Promise.resolve([])
          if (prop.toString().startsWith('update')) return Promise.resolve(args[1])
          if (prop.toString().startsWith('delete')) return Promise.resolve(null)
          return Promise.resolve(null)
        },
      })
    },
  }
  return new Proxy({}, handler)
}

// Factory to create Prisma client
const createPrisma = (): PrismaClient => {
  if (!process.env.DATABASE_URL) {
    console.warn('No DATABASE_URL found — using build-safe Prisma stub')
    return createPrismaStub() as unknown as PrismaClient
  }
  return new PrismaClient()
}

// Singleton pattern
declare global {
  var prismaGlobal: PrismaClient | undefined
}

const prisma: PrismaClient = globalThis.prismaGlobal ?? createPrisma()

// Persist Prisma client in dev to prevent multiple instances
if (process.env.NODE_ENV !== 'production' && process.env.DATABASE_URL) {
  globalThis.prismaGlobal = prisma
}

export default prisma
