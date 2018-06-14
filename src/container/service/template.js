
import TemplateService from '../../app/Service/Template/TemplateService'
import TemplateRepository from '../../app/Service/Template/TemplateRepository'
import TemplateValidator from '../../app/Service/Template/TemplateValidator'

export default (container) => {
  const logger = container.get('logger')

  container.service('templateServiceRepository', container => {
    const service = new TemplateRepository()
    service.setLogger(logger)

    return service
  })

  container.service('templateValidator', container => {
    const service = new TemplateValidator()
    service.setLogger(logger)

    return service
  })

  container.service('templateService', container => {
    const service = new TemplateService()
    service.setLogger(logger)
    service.setRepository(container.get('templateServiceRepository'))
    service.setValidator(container.get('templateValidator'))

    return service
  })
}
