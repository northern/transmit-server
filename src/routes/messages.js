
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

    const messageId = parseInt(req.params.id)

    // Retrieve message.
    response = await container.get('messageQuery').getById(messageId)

    if (response.status !== Response.OK) {
      throw new HttpError(response, HttpStatus.BAD_REQUEST)
    }

    const message = response.message    

    // Process the message.
    response = await container.get('messageProcessCommand').execute(message)

    if (response.status !== Response.OK) {
      throw new HttpError(response, HttpStatus.BAD_REQUEST)
    }

    result = response.transmissions
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
  const logger = container.get('logger')

  try {
    const response = await container.get('messageCreateCommand').execute(req.body)

    if (response.status !== Response.OK) {
      throw new HttpError(response, HttpStatus.BAD_REQUEST)
    }

    result = response.message
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
