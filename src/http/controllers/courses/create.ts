import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../../../database/client.ts'
import { courses } from '../../../database/schema.ts'
import z from 'zod'

export const createCourseRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/courses',
    {
      schema: {
        tags: ['Courses'],
        summary: 'Create a new course',
        body: z.object({
          title: z.string().min(5, 'Title must be at least 5 characters long'),
          description: z.string().nullable(),
        }),
        response: {
          201: z
            .object({
              couseId: z.uuid(),
            })
            .describe('Response when the course is created successfully'),
        },
      },
    },
    async (request, reply) => {
      const { title, description } = request.body

      const result = await db
        .insert(courses)
        .values({
          title,
          description,
        })
        .returning()

      return reply.status(201).send({ couseId: result[0].id })
    }
  )
}
