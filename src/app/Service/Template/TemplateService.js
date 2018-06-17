
import _ from 'lodash'

import Template from '../../Entity/Template'
import Revision from '../../Entity/Template/Revision'
import TemplateNotFoundByIdError from './Error/TemplateNotFoundByIdError'

export default class TemplateService {
  setLogger(logger) {
    this.logger = logger
  }

  setRepository(repository) {
    this.repository = repository;
  }

  setValidator(validator) {
    this.validator = validator
  }

  getById(id) {
    const template = this.repository.getById(id)

    if (!template) {
      throw new TemplateNotFoundByIdError(id)
    }

    return template
  }


  getRevision(template, number) {
    const revision = _.find(template.revisions, {number: number})

    // TODO: Error handling for not found.

    return revision
  }

  getActiveRevision(template) {
    return this.getRevision(template, template.revision)
  }

  create(name) {
    const template = new Template()
    template.id = Math.round(Math.random() * 1000)
    template.name = name

    return template
  }

  createInline(data) {
    const template = new Template(data)

    return template
  }

  createRevisionInline(data) {
    const revision = new Revision()
    revision.unserialize(data)

    return revision
  }
}
