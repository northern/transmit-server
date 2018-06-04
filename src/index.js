
import express from 'express'
import HttpStatus from 'http-status-codes'

const app = express()

app.get('/', (req, res) => {
  let result
  let status = HttpStatus.OK

  res.status(status).json(result)
})

app.listen(3000, () => console.info('Transmit Server running on port 3000'))
