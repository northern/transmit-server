
import Response from '../Response'
import AppError from '../Error/AppError'
import AbstractCommand from './AbstractCommand'

export default class MessageFinalizeCommand extends AbstractCommand {
  setMessageService(messageService) {
    this.messageService = messageService
  }

  setTransmissionService(transmissionService) {
    this.transmissionService = transmissionService
  }

  async execute(message) {
    const response = new Response()

    let connection

    try {
      connection = await this.persistenceService.getConnection()

      const transmissions = await this.transmissionService.getByMessageId(message.id, connection)

      const values = {
        status: this.messageService.getCombinedStatus(transmissions)
      }

      message = await this.messageService.update(message, values, connection)
    }
    catch(e) {
      if (e instanceof AppError) {
        response.status = Response.ERROR
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
