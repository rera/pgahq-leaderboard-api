
exports.up = function (knex, Promise) {
  return knex.schema.createTable('leaderboard', (table) => {
    table.increments('id').primary()
    table.string('firstName').notNullable()
    table.string('lastName').notNullable()
    table.integer('score').notNullable()
  })
}

exports.down = function (knex, Promise) {
  return knex.schema.dropTable('leaderboard')
}
