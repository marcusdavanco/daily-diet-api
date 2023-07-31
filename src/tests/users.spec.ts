import { it, afterAll, beforeAll, describe } from 'vitest'
import request from 'supertest'
import { app } from '../app'

describe('User routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new account', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'John Foe',
        email: 'johnfoe@email.com',
      })
      .expect(201)
  })
})
