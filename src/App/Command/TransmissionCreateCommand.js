
import Response from '../Response'
import AppError from '../Error/AppError'
import TransmissionValidationError from '../Service/Transmission/Error/TransmissionValidationError'

export default class TransmissionCreateCommand {
  setLogger(logger) {
    this.logger = logger
  }

  setPersistanceService(persistanceService) {
    this.persistanceService = persistanceService
  }

  setTransmissionService(transmissionService) {
    this.transmissionService = transmissionService
  }

  async execute(data) {
    const response = new Response()

    const connection = await this.persistanceService.beginTransaction()

    try {
      const transmission = await this.transmissionService.create(data, connection)

      response.transmission = transmission

      await this.persistanceService.commit(connection)
    }
    catch(e) {
      await this.persistanceService.rollback(connection)

      if (e instanceof TransmissionValidationError) {
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

    this.persistanceService.releaseConnection(connection)

    return response
  }
}
