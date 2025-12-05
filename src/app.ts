import fastify from 'fastify'

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
})

app.get('/hello', async (request, reply) => {
  return { message: 'Hello, World!' }
})

//33 minutos
