
import Template from '../../Entity/Template'

export default class TemplateRepository {
  setLogger(logger) {
    this.logger = logger
  }

  getById(id) {
    const template = new Template()
    template.id = id
    template.name = `Template #${id}`

    return template
  }
}
