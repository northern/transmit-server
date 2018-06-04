
import express from 'express'

import container from './container'
import routesApi from './routes/api'

const app = express()
app.container = container

app.use('/', routesApi)
app.use((err, req, res, next) => {
  console.error(err)

  res.sendStatus(500)
})

app.listen(3000, () => console.info('Transmit Server running on port 3000'))
