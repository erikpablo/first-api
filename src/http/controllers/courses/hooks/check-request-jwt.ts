import type { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'
import { env } from '../../../../env/index.ts'

export async function checkRequestJWT(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authHeader = request.headers.authorization

  if (!authHeader) {
    return reply.status(401).send()
  }

  const [, token] = authHeader.split(' ')

  if (!token) {
    return reply.status(401).send()
  }

  try {
    jwt.verify(token, env.JWT_SECRET)
  } catch (err) {
    console.log('ERRO REAL:', err)
    return reply.status(401).send()
  }
}
