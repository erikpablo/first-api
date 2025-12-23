import { describe, it, expect, beforeAll } from 'vitest'
import { app } from '../../../app.ts'
import supertest from 'supertest'
import { fakerPT_BR as faker } from '@faker-js/faker'

describe('Create courses', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  it('should be able to create courses', async () => {
    await app.ready()

    const response = await supertest(app.server)
      .post('/courses')
      .set('Content-Type', 'application/json')
      .send({
        title: faker.lorem.word(5),
      })

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({
      courseId: expect.any(String),
    })
  })
})
