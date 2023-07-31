import { it, afterAll, beforeAll, beforeEach, describe, expect } from 'vitest'
import request from 'supertest'
import { app } from '../app'
import { execSync } from 'node:child_process'

describe('Meal routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  beforeEach(() => {
    execSync('npm run knex migrate:rollback --all')
    execSync('npm run knex migrate:latest')
  })

  it(`should be possible to create a meal`, async () => {
    const createAccountResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@email.com',
      })

    const cookies = createAccountResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Birthday Cake',
        description: 'YUMMY!',
        date: new Date(),
        on_diet: false,
      })
      .expect(201)
  })

  it(`should be possible to edit a meal`, async () => {
    const createAccountResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@email.com',
      })
      .expect(201)

    const cookies = createAccountResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Birthday Cake',
        description: 'YUMMY!',
        date: new Date(),
        on_diet: false,
      })
      .expect(201)

    const listMealResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const [meal] = listMealResponse.body.meals

    await request(app.server)
      .put(`/meals/${meal.id}`)
      .set('Cookie', cookies)
      .send({
        name: 'Birthday Cake',
        description: 'NOT YUMMY!',
        date: new Date(),
        on_diet: false,
      })
      .expect(204)

    const listUpdatedMealResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listUpdatedMealResponse.body.meals[0]).toContain({
      description: 'NOT YUMMY!',
    })
  })

  it(`should be possible to remove a meal`, async () => {
    const createAccountResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@email.com',
      })
      .expect(201)

    const cookies = createAccountResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Birthday Cake',
        description: 'YUMMY!',
        date: new Date(),
        on_diet: false,
      })
      .expect(201)

    const listMealResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const [meal] = listMealResponse.body.meals

    await request(app.server)
      .del(`/meals/${meal.id}`)
      .set('Cookie', cookies)
      .expect(204)
  })
  it(`should be possible to list all meals from a user`, async () => {
    const createAccountResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@email.com',
      })
      .expect(201)

    const cookies = createAccountResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Birthday Cake',
        description: 'YUMMY!',
        date: new Date(),
        on_diet: false,
      })
      .expect(201)

    const listMealResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)

    expect(listMealResponse.body.meals).toEqual([
      expect.objectContaining({ name: 'Birthday Cake' }),
    ])
  })

  it(`should only be possible to view, edit or remove meals the user created`, async () => {
    const createAccountResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@email.com',
      })
      .expect(201)

    const cookies = createAccountResponse.get('Set-Cookie')

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Birthday Cake',
        description: 'YUMMY!',
        date: new Date(),
        on_diet: false,
      })
      .expect(201)

    const listMealResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const [meal] = listMealResponse.body.meals

    await request(app.server).get('/meals').expect(401)

    await request(app.server).put(`/meals/${meal.id}`).expect(401)

    await request(app.server).del(`/meals/${meal.id}`).expect(401)
  })
})
