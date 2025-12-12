import fastify from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import fastifySwagger from '@fastify/swagger'
import { createCourseRoute } from './http/controllers/courses/create.ts'
import { getCoursesRoute } from './http/controllers/courses/get-courses.ts'
import { getCourseByIdRoute } from './http/controllers/courses/get-course-by-id.ts'
import scalarAPIReference from '@scalar/fastify-api-reference'

export const app = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
}).withTypeProvider<ZodTypeProvider>()

if (process.env.NODE_ENV === 'dev') {
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Courses API',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
  })

  app.register(scalarAPIReference, {
    routePrefix: '/docs',
  })
}

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createCourseRoute)
app.register(getCoursesRoute)
app.register(getCourseByIdRoute)
