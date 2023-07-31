import { it, afterAll, beforeAll, describe, expect } from 'vitest'
import request from 'supertest'
import { app } from '../app'

describe('User routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it.skip('should be able to view a user', async () => {
    const createAccountResponse = await request(app.server)
      .post('/users')
      .send({
        name: 'mu Doe',
        email: 'mu@email.com'
      })

     const [cookies] = createAccountResponse.get('Set-Cookie')

     const listUserResponse = await request(app.server)
      .get(`/users/${cookies}`)
      .set('Cookie', cookies)
      .expect(200)

      expect(listUserResponse.body.users).toEqual([
        expect.objectContaining({
          name: 'Jeff Doe',
          email: 'jeffdoe@email.com'
        })
      ])
  })

  it.skip('should be able to create a new account', async () => {
    const response = await request(app.server)
      .post('/users')
      .send({
        name: 'John John',
        email: 'johnjohn@email.com',
      })
      .expect(201)
  })
})
