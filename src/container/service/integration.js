
import IntegrationService from '../../app/Service/Integration/IntegrationService'

export default (bottle) => {
  bottle.factory('integrationService', container => {
    const { config } = container

    const service = new IntegrationService()
    service.setLogger(container.logger)
    service.init(config.integrations.channels, config.integrations.providers)

    return service
  })
}
