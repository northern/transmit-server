
import Response from '../Response'
import AppError from '../Error/AppError'

export default class TransmissionQueryRepository {
  setLogger(logger) {
    this.logger = logger
  }

  setTransmissionService(transmissionService) {
    this.transmissionService = transmissionService
  }

  getById(id) {
    const response = new Response()

    try {
      const transmission = this.transmissionService.getById(id)

      response.transmission = transmission
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

    return response
  }
}
