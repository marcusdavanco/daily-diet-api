import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('description')
    table.dateTime("date").notNullable()
    table.boolean("on_diet").notNullable()

  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}

