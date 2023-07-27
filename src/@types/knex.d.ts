import { Knex } from 'knex'

declare module 'knex/module/tables' {
  export interface Tables {
    users: {
      id: string,
      name: string,
      email: string,
      created_at: string,
      updated_at: string,
    }
  }
}