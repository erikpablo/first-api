import { faker } from '@faker-js/faker'
import { db } from '../../src/database/client'
import { courses } from '../../src/database/schema.ts'

export async function makeCourse(title?: string) {
  const result = await db
    .insert(courses)
    .values({
      title: title ?? faker.lorem.words(3),
    })
    .returning()

  return result[0]
}
