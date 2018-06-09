
import express from 'express'
import HttpStatus from 'http-status-codes'

import Response from '../app/Response'
import HttpError from './error/HttpError'

const router = express.Router()

router.post('/:id', async (req, res) => {
  let result
  let status = HttpStatus.ACCEPTED

  const container = req.app.container
  const logger = container.logger

  try {
    const transmissionId = parseInt(req.params.id)

    const response = await container.transmissionQuery.getById(transmissionId)

    if (response.status !== Response.OK) {
      throw new HttpError(response, HttpStatus.BAD_REQUEST)
    }

    const transmission = response.transmission    

    /*const response = await container.transmissionProcessCommand.execute(transmission)

    if (response.status !== Response.OK) {
      throw new HttpError(response, HttpStatus.BAD_REQUEST)
    }*/

    result = transmission
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

router.post('/', async (req, res) => {
  let result
  let status = HttpStatus.CREATED

  const container = req.app.container
  const logger = container.logger

  try {
    const response = await container.transmissionCreateCommand.execute(req.body)

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
