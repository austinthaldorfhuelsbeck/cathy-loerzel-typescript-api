exports.up = function (knex) {
  return knex.schema.createTable("events", (table) => {
    table.integer("event_id").primary()
    table.string("name")
    table.string("date")
    table.string("content", 10000)
  })
}

exports.down = function (knex) {
  return knex.schema.dropTable("events")
}
