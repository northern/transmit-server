
import Response from '../Response'
import AppError from '../Error/AppError'
import AbstractQuery from './AbstractQuery'

export default class TransmissionQuery extends AbstractQuery {
  setTransmissionService(transmissionService) {
    this.transmissionService = transmissionService
  }

  async getById(id) {
    const response = new Response()

    const connection = await this.persistenceService.getConnection()

    try {
      const transmission = await this.transmissionService.getById(id, connection)

      response.transmission = transmission
    }
    catch(e) {
      if (e instanceof AppError) {
        response.status = Response.ERROR
        response.transmission = e.transmission
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
