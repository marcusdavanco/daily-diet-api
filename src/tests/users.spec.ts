import { it, afterAll, beforeAll, beforeEach, describe, expect } from 'vitest'
import request from 'supertest'
import { app } from '../app'
import { execSync } from 'child_process'

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
    const response = await request(app.server)
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

    expect(listUserResponse.body.user).toContain(
      {
        name: 'John Doe',
        email: 'johndoe@email.com',
      }
    )
  })
})
