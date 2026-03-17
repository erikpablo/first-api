import { describe, it, expect, beforeAll } from 'vitest'
import { app } from '../../../app.ts'
import supertest from 'supertest'
import { fakerPT_BR as faker } from '@faker-js/faker'
import { makeAuthenticatedUser } from '../../../../tests/factories/make-user.ts'

describe('Create courses', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  it('should be able to create courses', async () => {
    const token = await makeAuthenticatedUser('manager')

    const response = await supertest(app.server)
      .post('/courses')
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: faker.lorem.word(5),
      })

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({
      courseId: expect.any(String),
    })
  })
})
