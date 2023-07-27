import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.dropColumn('session_id')
  })

  await knex.schema.alterTable('meals', (table) => {
    table
      .uuid('owner_id')      
      .references('users.id')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.uuid('session_id').after('id').index()
  })

  await knex.schema.alterTable('meals', (table) => {
    table.dropColumn('owner_id')
  })
}

