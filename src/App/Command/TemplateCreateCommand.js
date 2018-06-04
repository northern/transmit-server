
import Response from '../Response'

export default class TemplateCreateCommand {
  setLogger(logger) {
    this.logger = logger
  }

  setTemplateService(templateService) {
    this.templateService = templateService
  }

  execute(name) {
    const response = new Response()

    try {
      const template = this.templateService.create(name)

      response.template = template
    }
    catch(e) {
      if (e instanceof AppError) {
        response.status = Response.ERROR
        response.message = e.message
      }
      else {
        throw e
      }
    }

    return response
  }
}
