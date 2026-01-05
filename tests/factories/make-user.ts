import { faker } from '@faker-js/faker'
import { db } from '../../src/database/client'
import { users } from '../../src/database/schema.ts'
import { hash } from 'argon2'
import { randomUUID } from 'node:crypto'

export async function makeUser() {
  const passwordWithoutHash = randomUUID()

  const result = await db
    .insert(users)
    .values({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: await hash(passwordWithoutHash),
    })
    .returning()

  return {
    user: result[0],
    passwordWithoutHash,
  }
}
