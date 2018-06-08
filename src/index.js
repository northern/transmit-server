
import express from 'express'

import config from './config'
import container from './container'
import routes from './routes'

const app = express()
app.container = container(config())

app.use(express.json())
app.use('/', routes())
app.use((err, req, res, next) => {
  console.error(err)

  res.sendStatus(500)
})

app.listen(config().server.port, () => console.info(`Transmit Server running on port ${config().server.port}`))
