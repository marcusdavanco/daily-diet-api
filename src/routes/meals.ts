import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'

export async function mealRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string().optional(),
      date: z.string(),
      on_diet: z.boolean(),
    })

    const { name, description, date, on_diet } = createMealBodySchema.parse(request.body)

    let { userId } = request.cookies

    if(!userId){
      reply.status(401).send()
    }

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      date,
      on_diet,
      owner_id: userId
    })
    
  })


}
