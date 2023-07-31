import { it, afterAll, beforeAll, beforeEach, describe, expect } from 'vitest'
import request from 'supertest'
import { app } from '../app'
import { execSync } from 'node:child_process'

describe('User routes', () => {
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

  it('should be able to create a new account', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@email.com',
      })
      .expect(201)
  })

  it('should be able to view my own user', async () => {
    const createAccountResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@email.com',
      })

    const [cookies] = createAccountResponse.get('Set-Cookie')

    const listUserResponse = await request(app.server)
      .get(`/users/${cookies.split(';')[0].split('userId=')[1]}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(listUserResponse.body.user).toContain({
      name: 'John Doe',
      email: 'johndoe@email.com',
    })
  })

  it(`should be possible to recover the user metrics`, async () => {
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

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Apple',
        description: 'NOT YUMMY!',
        date: new Date(),
        on_diet: true,
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Banana',
        description: 'NOT YUMMY!',
        date: new Date(),
        on_diet: true,
      })
      .expect(201)

    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        name: 'Chocolate Bar',
        description: 'YUMMY!',
        date: new Date(),
        on_diet: false,
      })
      .expect(201)

    console.log(
      cookies[0],
      `/users/${cookies[0].split(';')[0].split('userId=')[1]}/metrics`,
    )

    const listMetricsResponse = await request(app.server)
      .get(`/users/${cookies[0].split(';')[0].split('userId=')[1]}/metrics`)
      .set('Cookie', cookies)
      .expect(200)

    expect(listMetricsResponse.body).toEqual({
      meals: 4,
      mealsOnDiet: 2,
      mealsOffDiet: 2,
      sequenceOfMealsOnDiet: 0,
      bestSequenceOfMealsOnDiet: 2,
    })
  })
})
