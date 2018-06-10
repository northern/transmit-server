
import TemplateQuery from '../app/Query/TemplateQuery'
import MessageQuery from '../app/Query/MessageQuery'

export default bottle => {
  bottle.factory('templateQuery', container => {
    const service = new TemplateQuery()
    service.setLogger(container.logger)
    service.setPersistenceService(container.persistenceService)
    service.setTemplateService(container.templateService)

    return service
  })

  bottle.factory('messageQuery', container => {
    const service = new MessageQuery()
    service.setLogger(container.logger)
    service.setPersistenceService(container.persistenceService)
    service.setMessageService(container.messageService)

    return service
  })
}
