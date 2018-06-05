
import Response from '../Response'
import AppError from '../Error/AppError'

export default class TransmissionCreateCommand {
  setLogger(logger) {
    this.logger = logger
  }

  setTransmissionService(transmissionService) {
    this.transmissionService = transmissionService
  }

  execute(name) {
    const response = new Response()

    try {
      const transmission = this.transmissionService.getById(1)

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
