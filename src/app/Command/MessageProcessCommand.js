
import _ from 'lodash'

import Response from '../Response'
import AppError from '../Error/AppError'
import AbstractCommand from './AbstractCommand'
import Message from '../Entity/Message'
import MessageValidationError from '../Service/Message/Error/MessageValidationError'
import DuplicateMessageProcessRequest from './Error/DuplicateMessageProcessRequest'

export default class MessageProcessCommand extends AbstractCommand {
  setQueueService(queueService) {
    this.queueService = queueService
  }

  setMessageService(messageService) {
    this.messageService = messageService
  }

  setTransmissionService(transmissionService) {
    this.transmissionService = transmissionService
  }

  setTemplateService(templateService) {
    this.templateService = templateService
  }

  setIntegrationService(integrationService) {
    this.integrationService = integrationService
  }

  setRecipientService(recipientService) {
    this.recipientService = recipientService
  }

  async execute(message) {
    const response = new Response()

    let connection

    try {
      // If a message is in a "processing" state then don't process again.
      if (message.status === Message.STATUS_PROCESSING) {
        throw new DuplicateMessageProcessRequest(message)
      }

      connection = await this.persistenceService.beginTransaction()

      // Either load the template or create an inline template.
      let template = null

      if (message.data.template.id) {
        // TODO: Load the template.
      }
      else {
        template = this.templateService.createInline(message.data.template)
      }

      // Get the specified or active revision from the template.
      let revision

      if (message.data.template.revision) {
        revision = this.templateService.getRevision(template, message.data.template.revision)
      }
      else {
        revision = this.templateService.getActiveRevision(template)
      }      

      // TODO: Check if revision is published.

      // Update the message status to 'processing'.
      const values = {
        status: Message.STATUS_PROCESSING,
        template: {
          revision: revision,
          vars: message.data.template.vars,
        },
      }

      message = await this.messageService.update(message, values, connection)

      // Create the individual transmissions.
      const transmissions = await this.transmissionService.create(message, revision, message.data.channels, connection)

      await this.persistenceService.commit(connection)
      await this.persistenceService.releaseConnection(connection)

      connection = null

      // Queue transmissions for processing.
      for(let i = 0; i < transmissions.length; i++) {
        await this.queueService.add({
          type: 'transmission',
          data: {
            id: transmissions[i].id,
          }
        })
      }

      response.transmissions = transmissions
    }
    catch(e) {
      await this.persistenceService.rollback(connection)

      if (e instanceof MessageValidationError) {
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
