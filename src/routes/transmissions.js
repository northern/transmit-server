
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
    let response

    const transmissionId = parseInt(req.params.id)

    result = {}

    /*
    // Retrieve message.
    response = await container.messageQuery.getById(messageId)

    if (response.status !== Response.OK) {
      throw new HttpError(response, HttpStatus.BAD_REQUEST)
    }

    const message = response.message    

    // Process the message.
    response = await container.messageProcessCommand.execute(message)

    if (response.status !== Response.OK) {
      throw new HttpError(response, HttpStatus.BAD_REQUEST)
    }

    result = response.transmissions
    */
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
