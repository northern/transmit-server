
import TemplateQuery from '../app/Query/TemplateQuery'
import MessageQuery from '../app/Query/MessageQuery'
import TransmissionQuery from '../app/Query/TransmissionQuery'

export default (container) => {
  const config = container.get('config')
  const logger = container.get('logger')

  container.service('templateQuery', container => {
    const service = new TemplateQuery()
    service.setLogger(logger)
    service.setPersistenceService(container.get('persistenceService'))
    service.setTemplateService(container.get('templateService'))

    return service
  }, true)

  container.service('messageQuery', container => {
    const service = new MessageQuery()
    service.setLogger(logger)
    service.setPersistenceService(container.get('persistenceService'))
    service.setMessageService(container.get('messageService'))

    return service
  }, true)

  container.service('transmissionQuery', container => {
    const service = new TransmissionQuery()
    service.setLogger(logger)
    service.setPersistenceService(container.get('persistenceService'))
    service.setTransmissionService(container.get('transmissionService'))

    return service
  }, true)
}
