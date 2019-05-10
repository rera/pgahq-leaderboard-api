const server = require('../server/index')
const request = require('supertest')
const knex = require('../server/connection')

describe('players', () => {
  beforeEach(async () => {
    await knex.migrate.rollback()
    await knex.migrate.latest()
    await knex.seed.run()
  })

  afterAll(async () => {
    await server.close()
    await knex.destroy()
  })

  describe('GET /', () => {
    it('returns json', async () => {
      const response = await request(server).get('/')
      expect(response.status).toEqual(200)
      expect(response.type).toEqual('application/json')
    })
  })

  describe('GET /players', () => {
    it('returns all players', async () => {
      const response = await request(server).get('/players')
      expect(response.status).toEqual(200)
      expect(response.type).toEqual('application/json')
      expect(response.body.data.length).toEqual(20)
      expect(Object.keys(response.body.data[0])).toEqual([ 'id', 'firstName', 'lastName', 'score' ])
    })
  })

  describe('GET /player/:id', () => {
    it('returns single player', async () => {
      const player = await knex('leaderboard').first()
      const response = await request(server).get(`/player/${player.id}`)
      expect(response.status).toEqual(200)
      expect(response.type).toEqual('application/json')
      expect(response.body.data.length).toEqual(1)
      expect(Object.keys(response.body.data[0])).toEqual([ 'id', 'firstName', 'lastName', 'score' ])
      expect(response.body.data[0].name).toEqual(player.name)
    })

    it('fails if player not exists', async () => {
      const response = await request(server).get('/player/99999')
      expect(response.status).toEqual(404)
      expect(response.type).toEqual('application/json')
      expect(response.body.success).toEqual(false)
      expect(response.body.error).toEqual('player_not_found')
    })
  })

  describe('POST /players', () => {
    it('returns new player', async () => {
      const newPlayer = {
        firstName: 'John',
        lastName: 'Doe',
        score: 99
      }
      const response = await request(server).post('/players').send(newPlayer)
      expect(response.status).toEqual(201)
      expect(response.type).toEqual('application/json')
      expect(response.body.data.length).toEqual(1)
      expect(Object.keys(response.body.data[0])).toEqual([ 'id', 'firstName', 'lastName', 'score' ])
      expect(response.body.data[0].firstName).toEqual(newPlayer.firstName)
      expect(response.body.data[0].lastName).toEqual(newPlayer.lastName)
      expect(response.body.data[0].score).toEqual(newPlayer.score)
    })

    it('fails if player missing data', async () => {
      const newPlayer = {
        firstName: 'John',
        score: 99
      }
      const response = await request(server).post('/players').send(newPlayer)
      expect(response.status).toEqual(400)
      expect(response.type).toEqual('application/json')
      expect(response.body.success).toEqual(false)
      expect(response.body.error).toEqual('create_player_failed')
    })
  })

  describe('PUT /players/:id', () => {
    it('returns updated player', async () => {
      const player = await knex('leaderboard').first()
      const newScore = Math.floor(Math.random() * 101)
      const response = await request(server).put(`/players/${player.id}`).send({
        score: newScore
      })
      expect(response.status).toEqual(200)
      expect(response.type).toEqual('application/json')
      expect(response.body.data.length).toEqual(1)
      expect(Object.keys(response.body.data[0])).toEqual([ 'id', 'firstName', 'lastName', 'score' ])
      expect(response.body.data[0].score).toEqual(newScore)
    })

    it('fails if player not exists', async () => {
      const newScore = Math.floor(Math.random() * 101)
      const response = await request(server).put('/players/999').send({
        score: newScore
      })
      expect(response.status).toEqual(404)
      expect(response.type).toEqual('application/json')
      expect(response.body.success).toEqual(false)
      expect(response.body.error).toEqual('player_not_found')
    })
  })

  describe('DELETE /players/:id', () => {
    it('returns deleted player', async () => {
      const players = await knex('leaderboard').select('*')
      let player = players[0]
      const beforeLength = players.length
      const response = await request(server).delete(`/players/${player.id}`)
      expect(response.status).toEqual(200)
      expect(response.type).toEqual('application/json')
      expect(response.body.data.length).toEqual(1)
      expect(Object.keys(response.body.data[0])).toEqual([ 'id', 'firstName', 'lastName', 'score' ])
      expect(response.body.data[0].id).toEqual(player.id)

      const updatedPlayers = await knex('leaderboard').select('*')
      expect(updatedPlayers.length).toEqual(beforeLength - 1)
    })

    it('fails if player not exists', async () => {
      const response = await request(server).delete('/players/99999')
      expect(response.status).toEqual(404)
      expect(response.type).toEqual('application/json')
      expect(response.body.success).toEqual(false)
      expect(response.body.error).toEqual('player_not_found')
    })
  })
})
