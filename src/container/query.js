
import TemplateQuery from '../app/Query/TemplateQuery'
import TransmissionQuery from '../app/Query/TransmissionQuery'

export default bottle => {
  bottle.factory('templateQuery', container => {
    const service = new TemplateQuery()
    service.setLogger(container.logger)
    service.setPersistenceService(container.persistenceService)
    service.setTemplateService(container.templateService)

    return service
  })

  bottle.factory('transmissionQuery', container => {
    const service = new TransmissionQuery()
    service.setLogger(container.logger)
    service.setPersistenceService(container.persistenceService)
    service.setTransmissionService(container.transmissionService)

    return service
  })
}
