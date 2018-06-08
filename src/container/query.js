
import TemplateQueryRepository from '../app/Query/TemplateQueryRepository'
import TransmissionQueryRepository from '../app/Query/TransmissionQueryRepository'

export default bottle => {
  bottle.factory('templateQueryRepository', container => {
    const service = new TemplateQueryRepository()
    service.setLogger(container.logger)
    service.setTemplateService(container.templateService)

    return service
  })

  bottle.factory('transmissionQueryRepository', container => {
    const service = new TransmissionQueryRepository()
    service.setLogger(container.logger)
    service.setTransmissionService(container.transmissionService)

    return service
  })
}
