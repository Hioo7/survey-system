import { PrismaClient } from '../src/generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'

const adapter = new PrismaPg(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = process.env.SEED_SUPER_USER_EMAIL ?? 'admin@example.com'
  const password = process.env.SEED_SUPER_USER_PASSWORD ?? 'changeme123'
  const hashed = await bcrypt.hash(password, 12)

  await prisma.superUser.upsert({
    where: { email },
    update: {},
    create: { email, password: hashed },
  })

  console.log(`SuperUser seeded: ${email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
