
import Response from '../Response'
import AppError from '../Error/AppError'
import AbstractCommand from './AbstractCommand'
import MessageValidationError from '../Service/Message/Error/MessageValidationError'

/**
 * This command accepts and validates raw message payload data and when valid it
 * will create and persist Message object in the database to then add a message to
 * the queue for the message to be processed.
 */
export default class MessageCreateCommand extends AbstractCommand {
  setQueueService(queueService) {
    this.queueService = queueService
  }

  setMessageService(messageService) {
    this.messageService = messageService
  }

  async execute(data) {
    const response = new Response()

    let connection

    try {
      connection = await this.persistenceService.beginTransaction()

      // Create and persist message.
      const message = await this.messageService.create(data, connection)

      await this.persistenceService.commit(connection)
      await this.persistenceService.releaseConnection(connection)

      connection = null

      // Queue message for processing.
      await this.queueService.add({
        type: 'message',
        data: {
          id: message.id,
        }
      })

      response.message = message
    }
    catch(e) {
      await this.persistenceService.rollback(connection)

      if (e instanceof MessageValidationError) {
        response.status  = Response.INVALID
        response.message = e.message
        response.errors  = e.errors
      }
      else
      if (e instanceof AppError) {
        response.status  = Response.ERROR
        response.message = e.message
      }
      else {
        throw e
      }
    }
    finally {
      await this.persistenceService.releaseConnection(connection)
    }

    return response
  }
}
