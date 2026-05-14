import { db } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function getSuperUserById(id: string) {
  return db.superUser.findUnique({ where: { id } })
}

export async function updateSuperUserEmail(id: string, email: string) {
  return db.superUser.update({ where: { id }, data: { email } })
}

export async function updateSuperUserPassword(id: string, newPassword: string) {
  const hashed = await bcrypt.hash(newPassword, 12)
  return db.superUser.update({ where: { id }, data: { password: hashed } })
}
