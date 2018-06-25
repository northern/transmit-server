
import express from 'express'
import HttpStatus from 'http-status-codes'

import Response from '../app/Response'
import HttpError from './error/HttpError'

const router = express.Router()

router.post('/:id', async (req, res) => {
  let result
  let status = HttpStatus.ACCEPTED

  const container = req.app.container
  const logger = container.get('logger')

  try {
    let response

    const transmissionId = parseInt(req.params.id)

    // Retrieve the transmission.
    response = await container.get('transmissionQuery').getById(transmissionId)

    if (response.status !== Response.OK) {
      throw new HttpError(response, HttpStatus.NOT_FOUND)
    }

    const transmission = response.transmission    

    // Retrieve the message of this transmission.
    response = await container.get('messageQuery').getById(transmission.messageId)

    if (response.status !== Response.OK) {
      throw new HttpError(response, HttpStatus.BAD_REQUEST)
    }

    const message = response.message    

    // Process the transmission.
    response = await container.get('transmissionProcessCommand').execute(message, transmission)

    if (response.status !== Response.OK) {
      throw new HttpError(response, HttpStatus.BAD_REQUEST)
    }

    // Finalize the message (i.e. check if all transmissions for message have been processed).
    response = await container.get('messageFinalizeCommand').execute(message)

    if (response.status !== Response.OK) {
      throw new HttpError(response, HttpError.BAD_REQUEST)
    }

    result = {}
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
