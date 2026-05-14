import { SignJWT, jwtVerify } from 'jose'

export type JWTPayload = {
  sub: string
  email: string
  role?: 'super-admin' | 'employee'
}

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET environment variable is not set')
  return new TextEncoder().encode(secret)
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(getSecret())
}

export async function signEmployeeToken(payload: {
  sub: string
  email: string
  expiresAt: Date
}): Promise<string> {
  return new SignJWT({ email: payload.email, role: 'employee' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(payload.expiresAt)
    .sign(getSecret())
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    if (typeof payload.sub !== 'string' || typeof payload.email !== 'string') return null
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role as JWTPayload['role'],
    }
  } catch {
    return null
  }
}
