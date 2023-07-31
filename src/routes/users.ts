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

  app.get('/:id/metrics', async (request, reply) => {
    const getUserParamsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = getUserParamsSchema.parse(request.params)

    const user = await knex('users').where('id', id).first()

    if (!user) {
      reply.status(404).send()
    }

    const { userId: ownerId } = request.cookies

    console.log(id === ownerId)

    if (!ownerId || id === ownerId) {
      reply.status(401).send()
    }

    const meals = await knex('meals').where('owner_id', ownerId).select('')

    const metrics = meals.reduce(
      (acc, meal) => {
        acc.meals++
        meal.on_diet
          ? (acc.mealsOnDiet++, acc.sequenceOfMealsOnDiet++)
          : (acc.mealsOffDiet++, (acc.sequenceOfMealsOnDiet = 0))
        acc.sequenceOfMealsOnDiet > acc.bestSequenceOfMealsOnDiet &&
          (acc.bestSequenceOfMealsOnDiet = acc.sequenceOfMealsOnDiet)

        return acc
      },
      {
        meals: 0,
        mealsOnDiet: 0,
        mealsOffDiet: 0,
        sequenceOfMealsOnDiet: 0,
        bestSequenceOfMealsOnDiet: 0,
      },
    )

    return metrics
  })

  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      name: z.string().min(3),
      email: z.string().email(),
    })

    const { name, email } = createUserBodySchema.parse(request.body)

    const id = randomUUID()

    await knex('users').insert({
      id,
      name,
      email,
    })

    reply.cookie('userId', id, {
      path: '/',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    })

    return reply.status(201).send()
  })
}
