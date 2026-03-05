import type { FastifyReply, FastifyRequest } from 'fastify'
import { getAuthenticatedUserFromRequest } from '../../../../utils/get-authenticated-user-from-request.ts'

type JWTPayload = {
  sub: string
  role: 'student' | 'manager'
}

export async function checkUserRole(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const user = getAuthenticatedUserFromRequest(request)

  if (user.role !== 'manager') {
    return reply.status(401).send()
  }
}
