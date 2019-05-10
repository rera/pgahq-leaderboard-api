const Koa = require('koa')
const cors = require('@koa/cors')
const bodyParser = require('koa-bodyparser')

const playersRoutes = require('./routes')

const app = new Koa()
const PORT = process.env.PORT || 8081

app.use(cors())
app.use(bodyParser())
app.use(playersRoutes.routes())

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`)
}).on('error', err => {
  console.error(err)
})

module.exports = server
