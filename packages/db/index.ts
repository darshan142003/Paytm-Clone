import { PrismaClient } from '@prisma/client'

// Create a stub for build/CI when DATABASE_URL is missing
const createPrismaStub = () => {
  console.warn('No DATABASE_URL found — using build-safe Prisma stub')

  const modelHandler: ProxyHandler<any> = {
    get: (_, modelName: string) => {
      // Each model is a proxy too
      return new Proxy({}, {
        get: (_, methodName: string) => {
          return async (...args: any[]) => {
            console.warn(`Prisma.${modelName}.${methodName} called, but DATABASE_URL not set. Skipping query.`)

            // Return sensible defaults for common methods
            if (['findMany', 'findManyOrThrow'].includes(methodName)) return []
            if (['findUnique', 'findFirst', 'findUniqueOrThrow', 'findFirstOrThrow'].includes(methodName)) return null
            if (methodName === 'create') return args[0] // return the input data
            if (methodName === 'update') return args[1] // return the update data
            if (methodName === 'delete') return null
            return null
          }
        }
      })
    }
  }

  return new Proxy({}, modelHandler) as unknown as PrismaClient
}

declare global {
  var prismaGlobal: PrismaClient | undefined
}

// Use real Prisma if DATABASE_URL exists, otherwise stub
const prisma: PrismaClient = globalThis.prismaGlobal ?? (
  process.env.DATABASE_URL ? new PrismaClient() : createPrismaStub()
)

if (process.env.NODE_ENV !== 'production' && process.env.DATABASE_URL) {
  globalThis.prismaGlobal = prisma
}

export default prisma
