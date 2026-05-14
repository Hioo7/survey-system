import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function findSuperUserByEmail(email: string) {
  return db.superUser.findUnique({ where: { email } })
}

export async function validateSuperUserPassword(
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword)
}
