
import Template from '../../Entity/Template'
import TemplateNotFoundByIdError from './Error/TemplateNotFoundByIdError'

export default class TemplateService {
  setLogger(logger) {
    this.logger = logger
  }

  setRepository(repository) {
    this.repository = repository;
  }

  getById(id) {
    const template = this.repository.getById(id)

    if (!template) {
      throw new TemplateNotFoundByIdError(id)
    }

    return template
  }

  create(name) {
    const template = new Template()
    template.id = Math.round(Math.random() * 1000)
    template.name = name

    return template
  }
}
