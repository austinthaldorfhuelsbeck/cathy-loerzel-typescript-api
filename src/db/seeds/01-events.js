const events = require("./01-events.json")

exports.seed = function (knex) {
  return knex.raw("TRUNCATE TABLE events RESTART IDENTITY CASCADE").then(() => {
    return knex("events").insert(events)
  })
}
