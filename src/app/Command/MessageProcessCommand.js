
import Response from '../Response'
import AppError from '../Error/AppError'
import AbstractCommand from './AbstractCommand'
import Message from '../Entity/Message'

export default class MessageProcessCommand extends AbstractCommand {
  setQueueService(queueService) {
    this.queueService = queueService
  }

  setMessageService(messageService) {
    this.messageService = messageService
  }

  async execute(message) {
    const response = new Response()

    let connection

    try {
      connection = await this.persistenceService.beginTransaction()

      const values = {
        status: Message.STATUS_PROCESSING
      }

      message = await this.messageService.update(message, values, connection)

      




      await this.persistenceService.commit(connection)
      await this.persistenceService.releaseConnection(connection)

      connection = null

      response.message = message


      /*
      const message = await this.messageService.create(data, connection)

      // TODO: Queue message for processing.
      await this.queueService.add({
        type: 'message',
        data: {
          id: message.id,
        }
      })
      */
    }
    catch(e) {
      await this.persistenceService.rollback(connection)

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
