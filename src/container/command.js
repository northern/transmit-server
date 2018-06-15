
import TemplateCreateCommand from '../app/Command/TemplateCreateCommand'
import MessageCreateCommand from '../app/Command/MessageCreateCommand'
import MessageProcessCommand from '../app/Command/MessageProcessCommand'
import TransmissionProcessCommand from '../app/Command/TransmissionProcessCommand'

export default container => {
  const config = container.get('config')
  const logger = container.get('logger')

  container.service('templateCreateCommand', container => {
    const service = new TemplateCreateCommand()
    service.setLogger(logger)
    service.setTemplateService(container.get('templateService'))

    return service
  }, true)

  container.service('messageCreateCommand', container => {
    const service = new MessageCreateCommand()
    service.setLogger(logger)
    service.setPersistenceService(container.get('persistenceService'))
    service.setQueueService(container.get('queueService'))
    service.setMessageService(container.get('messageService'))

    return service
  }, true)

  container.service('messageProcessCommand', container => {
    const service = new MessageProcessCommand()
    service.setLogger(logger)
    service.setPersistenceService(container.get('persistenceService'))
    service.setQueueService(container.get('queueService'))
    service.setMessageService(container.get('messageService'))
    service.setTransmissionService(container.get('transmissionService'))
    service.setTemplateService(container.get('templateService'))
    service.setIntegrationService(container.get('integrationService'))
    service.setRecipientService(container.get('recipientService'))

    return service
  }, true)

  container.service('transmissionProcessCommand', container => {
    const service = new TransmissionProcessCommand()
    service.setLogger(logger)
    service.setPersistenceService(container.get('persistenceService'))
    service.setQueueService(container.get('queueService'))
    service.setTransmissionService(container.get('transmissionService'))
    service.setIntegrationService(container.get('integrationService'))
    service.setTemplateService(container.get('templateService'))

    return service
  }, true)
}
