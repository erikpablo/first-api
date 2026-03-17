import { describe, it, expect, beforeAll } from 'vitest'
import { app } from '../../../app.ts'
import supertest from 'supertest'
import { fakerPT_BR as faker } from '@faker-js/faker'
import { makeCourse } from '../../../../tests/factories/make-course.ts'
import { randomUUID } from 'node:crypto'
import { makeAuthenticatedUser } from '../../../../tests/factories/make-user.ts'

describe('Get Courses By Id', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  it('should be able to get course by id', async () => {
    const token = await makeAuthenticatedUser('student')
    const newCourse = await makeCourse()

    const response = await supertest(app.server)
      .get(`/courses/${newCourse.id}`)
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: faker.lorem.word(5),
      })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      course: {
        id: expect.any(String),
        title: expect.any(String),
        description: null,
      },
    })
  })

  it('should not be able to get courses by id', async () => {
    const testId = randomUUID()

    const token = await makeAuthenticatedUser('student')

    const response = await supertest(app.server)
      .get(`/courses/${testId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toEqual(404)
  })
})
