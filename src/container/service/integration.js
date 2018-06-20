
import IntegrationService from '../../app/Service/Integration/IntegrationService'

export default async (container) => {
  const config = container.get('config')
  const logger = container.get('logger')

  container.service('integrationService', container => {
    const service = new IntegrationService()
    service.setLogger(logger)
    service.init(config.integrations.channels, config.integrations.settings)

    return service
  })
}
