const Router = require('koa-router')
const router = new Router()
const queries = require('./queries.js')

router.get('/', async ctx => {
  ctx.body = {
    success: true
  }
})

router.get('/players', async ctx => {
  try {
    const players = await queries.allPlayers()
    ctx.body = {
      success: true,
      data: players
    }
  } catch (err) {
    console.log(err)
    ctx.status = 400
    ctx.body = {
      success: false,
      error: 'query_error',
      message: err.message
    }
  }
})

router.get('/player/:id', async ctx => {
  try {
    const player = await queries.singlePlayer(ctx.params.id)
    if (player.length) {
      ctx.body = {
        success: true,
        data: player
      }
    } else {
      ctx.status = 404
      ctx.body = {
        success: false,
        error: 'player_not_found'
      }
    }
  } catch (err) {
    console.log(err)
    ctx.status = 400
    ctx.body = {
      success: false,
      error: 'query_error',
      message: err.message
    }
  }
})

router.post('/players', async ctx => {
  try {
    const player = await queries.addPlayer(ctx.request.body)
    if (player.length) {
      ctx.status = 201
      ctx.body = {
        success: true,
        data: player
      }
    } else {
      ctx.status = 400
      ctx.body = {
        success: false,
        error: 'create_player_failed'
      }
    }
  } catch (err) {
    ctx.status = 400
    ctx.body = {
      success: false,
      error: 'create_player_failed',
      message: err.message || 'Failed to create players.'
    }
  }
})

router.put('/players/:id', async ctx => {
  try {
    const player = await queries.updatePlayer(ctx.params.id, ctx.request.body)
    if (player.length) {
      ctx.status = 200
      ctx.body = {
        success: true,
        data: player
      }
    } else {
      ctx.status = 404
      ctx.body = {
        success: false,
        error: 'player_not_found'
      }
    }
  } catch (err) {
    ctx.status = 400
    ctx.body = {
      success: false,
      error: 'update_player_failed',
      message: err.message || 'Failed to update player.'
    }
  }
})

router.delete('/players/:id', async ctx => {
  try {
    const player = await queries.deletePlayer(ctx.params.id)
    if (player.length) {
      ctx.status = 200
      ctx.body = {
        success: true,
        data: player
      }
    } else {
      ctx.status = 404
      ctx.body = {
        success: false,
        error: 'player_not_found'
      }
    }
  } catch (err) {
    ctx.status = 400
    ctx.body = {
      success: false,
      error: 'delete_player_failed',
      message: err.message || 'Failed to delete player.'
    }
  }
})

module.exports = router
