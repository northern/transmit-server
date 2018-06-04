
import TemplateQueryRepository from '../App/Query/TemplateQueryRepository'

export default bottle => {
  bottle.factory('templateQueryRepository', container => {
    const service = new TemplateQueryRepository()
    service.setLogger(container.logger)
    service.setTemplateService(container.templateService)

    return service
  })
}
