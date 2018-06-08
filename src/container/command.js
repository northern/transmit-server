
import TemplateCreateCommand from '../App/Command/TemplateCreateCommand'
import TransmissionCreateCommand from '../App/Command/TransmissionCreateCommand'

export default bottle => {
  bottle.factory('templateCreateCommand', container => {
    const service = new TemplateCreateCommand()
    service.setLogger(container.logger)
    service.setTemplateService(container.templateService)

    return service
  })

  bottle.factory('transmissionCreateCommand', container => {
    const service = new TransmissionCreateCommand()
    service.setLogger(container.logger)
    service.setPersistenceService(container.persistenceService)
    service.setQueueService(container.queueService)
    service.setTransmissionService(container.transmissionService)

    return service
  })
}
