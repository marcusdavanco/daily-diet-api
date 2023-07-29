import { FastifyInstance } from 'fastify'
import { knex } from '../database'
import { z } from 'zod'
import { randomUUID } from 'crypto'

export async function mealRoutes(app: FastifyInstance) {
  app.get('/', async (request, reply) => {

    const { userId: ownerId } = request.cookies

    if (!ownerId){
      reply.status(401).send()
    }

    const meals = await knex('meals')
      .where('owner_id', ownerId )
      .select('*')

    return { meals }
  })

  app.get('/:id', async (request, reply) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = getMealParamsSchema.parse(request.params)

    const { userId: ownerId } = request.cookies

    if(!ownerId) {
      reply.status(401).send()
    }

    const meal = await knex('meals')
      .where({
        owner_id: ownerId,
        id,
      })
      .first()

    if(!meal){
      reply.status(404).send()
    }
    
    return { meal }
  })
  
  app.post('/', async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string().optional(),
      date: z.string(),
      on_diet: z.boolean(),
    })

    const { name, description, date, on_diet } = createMealBodySchema.parse(request.body)

    let { userId: ownerId } = request.cookies

    if(!ownerId){
      reply.status(401).send()
    }

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      date,
      on_diet,
      owner_id: ownerId
    })

    reply.status(201).send()
    
  })

  app.put('/:id', async (request, reply) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = getMealParamsSchema.parse(request.params)

    const { userId: ownerId } = request.cookies

    if(!ownerId) {
      reply.status(401).send()
    }

    const createMealBodySchema = z.object({
      name: z.string(),
      description: z.string().optional(),
      date: z.string(),
      on_diet: z.boolean(),
    })

    const { name, description, date, on_diet } = createMealBodySchema.parse(request.body)

    const meal = await knex('meals')
    .where({
      owner_id: ownerId,
      id,
    })
    .first()

    if (!meal){
      reply.status(404).send()
    }

    await knex('meals')
      .where('id', id)
      .update({
        name,
        description,
        date,
        on_diet,
      })
           
    reply.status(204).send()    
  })

  app.delete('/:id', async (request, reply) => {
    const getMealParamsSchema = z.object({
      id: z.string().uuid()
    })

    const { id } = getMealParamsSchema.parse(request.params)

    const { userId: ownerId } = request.cookies

    if(!ownerId) {
      reply.status(401).send()
    }


    const meal = await knex('meals')
    .where({
      owner_id: ownerId,
      id,
    })
    .first()

    if (!meal){
      reply.status(404).send()
    }

    await knex('meals')
    .where({ id })
    .del() 
    
    reply.status(204).send()
    
  })
}
