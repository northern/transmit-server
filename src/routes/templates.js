
import express from 'express'
import HttpStatus from 'http-status-codes'

import Response from '../app/Response'
import HttpError from './error/HttpError'

const router = express.Router()

/**
 * Returns all available templates.
 */
router.get('/', (req, res) => {
  let result
  let status = HttpStatus.OK

  const container = req.app.container
  const logger = container.logger

  try {
    result = []
  }
  catch(e) {
    if (e instanceof HttpError) {
      status = e.code
      result = {
        message: e.message
      }
    }
    else {
      throw e
    }
  }
 
  res.status(status).json(result)
})

/**
 * Creates a new template.
 */
router.post('/', (req, res) => {
  let result
  let status = HttpStatus.CREATED

  const container = req.app.container
  const logger = container.logger

  try {
    const response = container.templateCreateCommand.execute("test")

    if (response.status !== Response.OK) {
      throw new HttpError(response.message, HttpStatus.BAD_REQUEST)
    }

    result = response.template
  }
  catch(e) {
    if (e instanceof HttpError) {
      status = e.code
      result = {
        message: e.message
      }
    }
    else {
      throw e
    }
  }
 
  res.status(status).json(result) 
})

/**
 * Returns a single template identified by its Id.
 */
router.get('/:id', (req, res) => {
  let result
  let status = HttpStatus.OK

  const container = req.app.container
  const logger = container.logger

  const templateId = req.params.id

  try {
    const response = container.templateQueryRepository.getById(templateId)

    if (response.status !== Response.OK) {
      throw new HttpError(response.message, HttpStatus.BAD_REQUEST)
    }

    result = response.template
  }
  catch(e) {
    if (e instanceof HttpError) {
      status = e.code
      result = {
        message: e.message
      }
    }
    else {
      throw e
    }
  }

  res.status(status).json(result)
})

/**
 * Updates a single template identified by its Id.
 */
router.put('/:id', (req, res) => {
  const container = req.app.container
  const logger = container.logger

  const templateId = req.params.id

  res.status(HttpStatus.OK).json({})
})

export default router
