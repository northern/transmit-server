
import Response from '../Response'
import AppError from '../Error/AppError'

export default class TemplateQueryRepository {
  setLogger(logger) {
    this.logger = logger
  }

  setTemplateService(templateService) {
    this.templateService = templateService
  }

  getById(templateId) {
    const response = new Response()

    try {
      const template = this.templateService.getById(templateId)

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
