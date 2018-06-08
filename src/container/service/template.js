
import TemplateService from '../../app/Service/Template/TemplateService'
import TemplateRepository from '../../app/Service/Template/TemplateRepository'
import TemplateValidator from '../../app/Service/Template/TemplateValidator'

export default (bottle) => {
  bottle.factory('templateServiceRepository', container => {
    const service = new TemplateRepository()
    service.setLogger(container.logger)

    return service
  })

  bottle.factory('templateValidator', container => {
    const service = new TemplateValidator()
    service.setLogger(container.logger)

    return service
  })

  bottle.factory('templateService', container => {
    const service = new TemplateService()
    service.setLogger(container.logger)
    service.setRepository(container.templateServiceRepository)
    service.setValidator(container.templateValidator)

    return service
  })
}
