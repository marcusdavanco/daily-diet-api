import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { knex } from '../database'

export async function userRoutes(app: FastifyInstance) {
  app.get('/:id', async (request) => {
    const getUserParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getUserParamsSchema.parse(request.params)

    const user = await knex('users').where('id', id).first()

    return { user }
  })
  
  
  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string().min(3),
      email: z.string().email(),      
    })

    const { name, email } = createUserBodySchema.parse(request.body)

    await knex('users')
      .insert({
        id: randomUUID(),
        name,
        email,         
      })

    return reply.status(201).send()
  })
}