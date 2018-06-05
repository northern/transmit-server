
import express from 'express'

import container from './container'
import routes from './routes'

const app = express()
app.container = container

app.use(express.json())
app.use('/', routes)
app.use((err, req, res, next) => {
  console.error(err)

  res.sendStatus(500)
})

app.listen(3000, () => console.info('Transmit Server running on port 3000'))
