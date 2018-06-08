
import TemplateNotFoundError from './TemplateNotFoundError'

export default class TemplateNotFoundByIdError extends TemplateNotFoundError {
  constructor(id) {
    super(`Template with id '${id}' was not found.`)
  }
}
