import type { FastifyReply, FastifyRequest } from 'fastify'
import jwt from 'jsonwebtoken'
import { env } from '../../../../env/index.ts'

type JWTPayload = {
  sub: string
  role: 'student' | 'manager'
}

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
    const payload = jwt.verify(token, env.JWT_SECRET) as JWTPayload
    request.user = payload
  } catch (err) {
    return reply.status(401).send()
  }
}
