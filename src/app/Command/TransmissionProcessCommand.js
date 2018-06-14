
import Response from '../Response'
import AppError from '../Error/AppError'
import AbstractCommand from './AbstractCommand'
import Transmission from '../Entity/Transmission'
import TransmissionValidationError from '../Service/Transmission/Error/TransmissionValidationError'

export default class TransmissionProcessCommand extends AbstractCommand {
  setQueueService(queueService) {
    this.queueService = queueService
  }

  setTransmissionService(transmissionService) {
    this.transmissionService = transmissionService
  }

  setIntegrationService(integrationService) {
    this.integrationService = integrationService
  }

  async execute(message, transmission) {
    const response = new Response()

    let connection

    try {
      connection = await this.persistenceService.beginTransaction()

      // Update the transmission status to 'processing'.
      const values = {
        status: Transmission.STATUS_PROCESSING,
      }

      transmission = await this.transmissionService.update(transmission, values, connection)

      // Get the available integrations.
      const integrations = this.integrationService.getIntegrations()

      // Send the message..
      this.transmissionService.send(message, transmission, integrations)


      await this.persistenceService.commit(connection)
      await this.persistenceService.releaseConnection(connection)

      connection = null
    }
    catch(e) {
      await this.persistenceService.rollback(connection)

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
    finally {
      await this.persistenceService.releaseConnection(connection)
    }

    return response
  }
}
