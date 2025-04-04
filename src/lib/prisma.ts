import { PrismaClient } from '@prisma/client'

// Type-safe global prisma client
declare global {
  var prisma: PrismaClient | undefined
}

// Proper initialization pattern for Next.js
const prisma = globalThis.prisma || new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error']
})

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma
}

export default prisma