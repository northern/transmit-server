
import express from 'express'
import HttpStatus from 'http-status-codes'

import Response from '../App/Response'
import HttpError from './error/HttpError'

const router = express.Router()

router.post('/', (req, res) => {
  let result
  let status = HttpStatus.CREATED

  const container = req.app.container
  const logger = container.logger

  try {
    const response = container.transmissionCreateCommand.execute(req.body)

    if (response.status !== Response.OK) {
      throw new HttpError(response, HttpStatus.BAD_REQUEST)
    }

    result = response.transmission
  }
  catch(e) {
    if (e instanceof HttpError) {
      status = e.code
      result = e.response
    }
    else {
      throw e
    }
  }
 
  res.status(status).json(result) 
})

export default router
