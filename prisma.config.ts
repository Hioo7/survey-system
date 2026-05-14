import { defineConfig } from 'prisma/config'
import * as dotenv from 'dotenv'

// Load env files so DATABASE_URL is available to Prisma CLI commands.
// .env.local takes precedence over .env (Next.js convention).
dotenv.config({ path: '.env.local' })
dotenv.config({ path: '.env' })

export default defineConfig({
  datasource: {
    url: process.env.DATABASE_URL,
  },
  migrations: {
    seed: 'tsx prisma/seed.ts',
  },
})
