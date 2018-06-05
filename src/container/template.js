
import TemplateService from '../App/Service/Template/TemplateService'
import TemplateRepository from '../App/Service/Template/TemplateRepository'

export default bottle => {
  bottle.factory('templateServiceRepository', container => {
    const service = new TemplateRepository()
    service.setLogger(container.logger)

    return service
  })

  bottle.factory('templateService', container => {
    const service = new TemplateService()
    service.setLogger(container.logger)
    service.setRepository(container.templateServiceRepository)

    return service
  })
}
