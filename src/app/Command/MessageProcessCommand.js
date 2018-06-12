
import _ from 'lodash'

import Response from '../Response'
import AppError from '../Error/AppError'
import AbstractCommand from './AbstractCommand'
import Message from '../Entity/Message'

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

  async execute(message) {
    const response = new Response()

    let connection

    try {
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
        template: templateRevision,
      }

      message = await this.messageService.update(message, values, connection)

      // TODO: Get the integrations.
      const integrations = []


      // TODO: Get the recipients.
      const recipients = []

      // Create the individual transmissions.
      const transmissions = this.transmissionService.create(message, templateRevision, integrations, recipients)



      await this.persistenceService.commit(connection)
      await this.persistenceService.releaseConnection(connection)

      connection = null

      response.message = message
    }
    catch(e) {
      await this.persistenceService.rollback(connection)

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
