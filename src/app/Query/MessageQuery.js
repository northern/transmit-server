
import Response from '../Response'
import AppError from '../Error/AppError'
import AbstractQuery from './AbstractQuery'

export default class MessageQuery extends AbstractQuery {
  setMessageService(messageService) {
    this.messageService = messageService
  }

  async getById(id) {
    const response = new Response()

    const connection = await this.persistenceService.getConnection()

    try {
      const message = await this.messageService.getById(id, connection)

      response.message = message
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
