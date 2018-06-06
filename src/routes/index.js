
import express from 'express'
import HttpStatus from 'http-status-codes'

import routesTemplate from './template'
import routesTranmission from './transmission'

export default () => {
  const router = express.Router()

  router.get('/', (req, res) => {
    return res.sendStatus(HttpStatus.FORBIDDEN)
  })

  router.use('/templates', routesTemplate)
  router.use('/transmissions', routesTranmission)

  return router
}
