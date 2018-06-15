
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
      if (message.status !== Message.STATUS_PENDING) {
        throw new DuplicateMessageProcessRequest(message)
      }

      connection = await this.persistenceService.beginTransaction()

      // Either load the template or create an inline template and obtain the active revision.
      let template = null

      const templateId = _.get(message.data, 'template.id')

      if (templateId) {
        // TODO: Load the template.
      }
      else {
        template = this.templateService.createInline(message.data.template)
      }

      const templateRevision = template.getActiveRevision()

      // Update the message status to 'processing'.
      const values = {
        status: Message.STATUS_PROCESSING,
        template: {
          revision: templateRevision,
          blocks: null,
        },
      }

      message = await this.messageService.update(message, values, connection)

      // Get the available integrations.
      const integrations = this.integrationService.getIntegrations()

      // Get the recipients from the message.
      const recipients = this.recipientService.create(message)

      // Create the individual transmissions.
      const transmissions = await this.transmissionService.create(message, templateRevision, integrations, recipients, connection)

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
