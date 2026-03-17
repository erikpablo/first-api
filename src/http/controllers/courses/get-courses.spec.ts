import { describe, it, expect, beforeAll, beforeEach } from 'vitest'
import { app } from '../../../app.ts'
import supertest from 'supertest'
import { makeCourse } from '../../../../tests/factories/make-course.ts'
import { randomUUID } from 'node:crypto'
import { makeAuthenticatedUser } from '../../../../tests/factories/make-user.ts'

describe('Get Courses', async () => {
  beforeEach(async () => {
    await app.ready()
  })

  it('should be able to get courses', async () => {
    const titleId = randomUUID()

    const token = await makeAuthenticatedUser('manager')

    const newCourse = await makeCourse(titleId)

    const response = await supertest(app.server)
      .get(`/courses?search=${titleId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      total: 1,
      courses: [
        {
          id: expect.any(String),
          title: titleId,
          enrollments: 0,
        },
      ],
    })
  })
})
