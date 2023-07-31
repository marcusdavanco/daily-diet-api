import { it, afterAll, beforeAll, beforeEach, describe } from 'vitest'
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

  it(`should be possible to register a meal`, async () => {
    
  })
  it(`should be possible to edit a meal`, async () => {
    // TODO
  })
  it(`should be possible to create a meal`, async () => {
    // TODO
  })
  it(`should be possible to list all meals from a user`, async () => {
    // TODO
  })

  it(`should be possible to identify the user between requests`, async () => {
    // TODO
  })

  it(`should only be possible to view, edit or remove meals the user created`, async () => {
    // TODO
  })
})

