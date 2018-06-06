
import Response from '../Response'
import AppError from '../Error/AppError'
import TransmissionValidationError from '../Service/Transmission/Error/TransmissionValidationError'

export default class TransmissionCreateCommand {
  setLogger(logger) {
    this.logger = logger
  }

  setTransmissionService(transmissionService) {
    this.transmissionService = transmissionService
  }

  execute(data) {
    const response = new Response()

    this.transmissionService.beginTransaction()

    try {
      const transmission = this.transmissionService.create(data)

      response.transmission = transmission

      this.transmissionService.commitTransaction()
    }
    catch(e) {
      this.transmissionService.rollbackTransaction()
      
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

    return response
  }
}
