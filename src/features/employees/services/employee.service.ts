import { db } from '@/lib/db'

export type EmployeeDTO = {
  id: string
  name: string
  email: string
  createdAt: string
}

export async function getAllEmployees(): Promise<EmployeeDTO[]> {
  const employees = await db.employee.findMany({ orderBy: { createdAt: 'desc' } })
  return employees.map((e) => ({ ...e, createdAt: e.createdAt.toISOString() }))
}

export async function getEmployeeById(id: string): Promise<EmployeeDTO | null> {
  const e = await db.employee.findUnique({ where: { id } })
  if (!e) return null
  return { ...e, createdAt: e.createdAt.toISOString() }
}

export async function createEmployee(data: { name: string; email: string }): Promise<EmployeeDTO> {
  const e = await db.employee.create({ data })
  return { ...e, createdAt: e.createdAt.toISOString() }
}

export async function updateEmployee(
  id: string,
  data: { name: string; email: string },
): Promise<EmployeeDTO> {
  const e = await db.employee.update({ where: { id }, data })
  return { ...e, createdAt: e.createdAt.toISOString() }
}

export async function deleteEmployee(id: string): Promise<void> {
  await db.employee.delete({ where: { id } })
}
