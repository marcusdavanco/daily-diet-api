import { Knex } from 'knex'

declare module 'knex/module/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      created_at: string
      updated_at: string
    }
    
    meals: {
      id: string
      name: string
      description?: string
      date: string
      on_diet: boolean
      created_at: string
      updated_at: string
      owner_id?: string
    }
  }
}
