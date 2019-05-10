const playersData = require('./db.json')

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex('leaderboard').del()
    .then(function () {
      // Inserts seed entries
      return knex('leaderboard').insert(playersData)
    })
}
