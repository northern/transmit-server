
import TemplateCreateCommand from '../app/Command/TemplateCreateCommand'
import MessageCreateCommand from '../app/Command/MessageCreateCommand'
import MessageProcessCommand from '../app/Command/MessageProcessCommand'

export default bottle => {
  bottle.factory('templateCreateCommand', container => {
    const service = new TemplateCreateCommand()
    service.setLogger(container.logger)
    service.setTemplateService(container.templateService)

    return service
  })

  bottle.factory('messageCreateCommand', container => {
    const service = new MessageCreateCommand()
    service.setLogger(container.logger)
    service.setPersistenceService(container.persistenceService)
    service.setQueueService(container.queueService)
    service.setMessageService(container.messageService)

    return service
  })

  bottle.factory('messageProcessCommand', container => {
    const service = new MessageProcessCommand()
    service.setLogger(container.logger)
    service.setPersistenceService(container.persistenceService)
    service.setQueueService(container.queueService)
    service.setMessageService(container.messageService)

    return service
  })
}
