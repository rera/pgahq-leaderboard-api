const knex = require('./connection')

module.exports = {
  allPlayers: async function () {
    return knex('leaderboard')
      .select('*')
  },
  singlePlayer: function (id) {
    return knex('leaderboard')
      .select('*')
      .where({ id: id })
  },
  addPlayer: function (player) {
    return knex('leaderboard')
      .insert(player)
      .returning('*')
  },
  updatePlayer: function (id, player) {
    return knex('leaderboard')
      .update(player)
      .where({ id: id })
      .returning('*')
  },
  deletePlayer: function (id) {
    return knex('leaderboard')
      .del()
      .where({ id: id })
      .returning('*')
  }
}
