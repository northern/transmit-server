
import express from 'express'
import morgan from 'morgan'

import config from './config'
import routes from './routes'
import container from './container'

const server = express()
server.container = container(config())

if (config().isDebug) {
  server.use(morgan('combined'))
}

server.use(express.json())
server.use('/', routes())
server.use((err, req, res, next) => {
  console.error(err)

  res.sendStatus(500)
})

server.listen(config().server.port, () => console.info(`Transmit Server running on port ${config().server.port}`))
