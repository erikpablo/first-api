import { faker } from '@faker-js/faker'
import { db } from '../../src/database/client'
import { users } from '../../src/database/schema.ts'
import { hash } from 'argon2'
import jwt from 'jsonwebtoken'
import { randomUUID } from 'node:crypto'
import { env } from '../../src/env/index.ts'

export async function makeUser(role?: 'student' | 'manager') {
  const passwordWithoutHash = randomUUID()

  const result = await db
    .insert(users)
    .values({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: await hash(passwordWithoutHash),
      role,
    })
    .returning()

  return {
    user: result[0],
    passwordWithoutHash,
  }
}

export async function makeAuthenticatedUser(role: 'student' | 'manager') {
  const { user } = await makeUser(role)

  const token = jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET)

  return token
}
