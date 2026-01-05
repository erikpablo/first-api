import { describe, it, expect, beforeAll } from 'vitest'
import { app } from '../../../app.ts'
import supertest from 'supertest'
import { fakerPT_BR as faker } from '@faker-js/faker'
import { makeUser } from '../../../../tests/factories/make-user.ts'

describe('Login', async () => {
  beforeAll(async () => {
    await app.ready()
  })

  it('should be able to login', async () => {
    const { user, passwordWithoutHash } = await makeUser()

    const response = await supertest(app.server)
      .post('/sessions')
      .set('Content-Type', 'application/json')
      .send({
        email: user.email,
        password: passwordWithoutHash,
      })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      message: 'Login successful',
    })
  })
})
