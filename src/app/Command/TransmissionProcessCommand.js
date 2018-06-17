
import Response from '../Response'
import AppError from '../Error/AppError'
import AbstractCommand from './AbstractCommand'
import Transmission from '../Entity/Transmission'
import TransmissionValidationError from '../Service/Transmission/Error/TransmissionValidationError'
import DuplicateTransmissionProcessRequest from './Error/DuplicateTransmissionProcessRequest'

export default class TransmissionProcessCommand extends AbstractCommand {
  setQueueService(queueService) {
    this.queueService = queueService
  }

  setMessageService(messageService) {
    this.messageService = messageService
  }

  setTransmissionService(transmissionService) {
    this.transmissionService = transmissionService
  }

  setIntegrationService(integrationService) {
    this.integrationService = integrationService
  }

  setTemplateService(templateService) {
    this.templateService = templateService
  }

  setDefaults(defaults) {
    this.defaults = defaults
  }

  async execute(message, transmission) {
    const response = new Response()

    let connection

    try {
      // If a transmission is in a "processing" state then don't process again.
      if (transmission.status === Transmission.STATUS_PROCESSING) {
        throw new DuplicateTransmissionProcessRequest(transmission)
      }

      connection = await this.persistenceService.beginTransaction()

      // Update the transmission status to 'processing'.
      const values = {
        status: Transmission.STATUS_PROCESSING,
      }

      transmission = await this.transmissionService.update(transmission, values, connection)

      // Create the template revision from the message and the rendered title & body.
      const revision = this.templateService.createRevisionInline(message.template.revision)

      // Get the integration for this transmission.
      const integration = await this.integrationService.getIntegration(transmission.channel, connection)

      // Send the message..
      await this.transmissionService.send(transmission, revision, integration, message.template.vars, this.defaults)

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
