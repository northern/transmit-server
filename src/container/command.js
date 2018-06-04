
import TemplateCreateCommand from '../App/Command/TemplateCreateCommand'

export default bottle => {
  bottle.factory('templateCreateCommand', container => {
    const service = new TemplateCreateCommand()
    service.setLogger(container.logger)
    service.setTemplateService(container.templateService)

    return service
  })
}
