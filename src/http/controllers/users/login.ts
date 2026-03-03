import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../../../database/client.ts'
import { users } from '../../../database/schema.ts'
import z from 'zod'
import { eq } from 'drizzle-orm'
import { verify } from 'argon2'
import jwt from 'jsonwebtoken'
import { env } from '../../../env/index.ts'

export const loginRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/sessions',
    {
      schema: {
        tags: ['auth'],
        summary: 'Login a user',
        body: z.object({
          email: z.email(),
          password: z.string().min(6),
        }),
        response: {
          200: z.object({
            token: z.string(),
          }),
          401: z.object({
            message: z
              .string()
              .describe('Error message for invalid credentials'),
          }),
        },
      },
    },
    async (request, reply) => {
      const { email, password } = request.body

      const result = await db.select().from(users).where(eq(users.email, email))

      if (result.length === 0) {
        return reply.status(401).send({ message: 'Invalid email or password' })
      }

      const user = result[0]

      const doesPasswordMatch = verify(user.password, password)

      if (!doesPasswordMatch) {
        return reply.status(401).send({ message: 'Invalid email or password' })
      }

      const token = jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET)

      return reply.status(200).send({ token })
    },
  )
}
