
import express from 'express'
import HttpStatus from 'http-status-codes'

import routesTemplate from './templates'
import routesMessage from './messages'
import routesTransmission from './transmissions'

export default () => {
  const router = express.Router()

  router.get('/', (req, res) => {
    return res.sendStatus(HttpStatus.FORBIDDEN)
  })

  router.use('/templates', routesTemplate)
  router.use('/messages', routesMessage)
  router.use('/transmissions', routesTransmission)

  return router
}
