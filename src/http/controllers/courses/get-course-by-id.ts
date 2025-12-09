import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../../database/client.ts'
import { courses } from '../../../database/schema.ts'
import { desc, eq } from 'drizzle-orm'

export const getCourseByIdRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/courses/:id',
    {
      schema: {
        tags: ['Courses'],
        summary: 'Get course by ID',
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: z.object({
            course: z.object({
              id: z.uuid(),
              title: z.string(),
              description: z.string().nullable(),
            }),
          }),
          404: z.null(),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params

      const result = await db.select().from(courses).where(eq(courses.id, id))

      if (result.length > 0) {
        return reply.send({ course: result[0] })
      }

      return reply.status(404).send()
    }
  )
}
