import { describe, it, expect, beforeAll } from 'vitest'
import { app } from '../../../app.ts'
import supertest from 'supertest'
import { fakerPT_BR as faker } from '@faker-js/faker'
import { makeCourse } from '../../../../tests/factories/make-course.ts'
import { randomUUID } from 'node:crypto'

describe('Get Courses By Id', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  it('should be able to get course by id', async () => {
    await app.ready()

    const newCourse = await makeCourse()

    const response = await supertest(app.server)
      .get(`/courses/${newCourse.id}`)
      .set('Content-Type', 'application/json')
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

    const response = await supertest(app.server).get(`/courses/${testId}`)

    expect(response.status).toEqual(404)
  })
})
