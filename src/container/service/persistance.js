
import PersistenceService from '../../app/Service/Persistence/PersistenceService'
import MySqlProvider from '../../app/Service/Persistence/Provider/MySqlProvider'

export default async (container) => {
  container.service('persistenceService', container => {
    const config = container.get('config')
    const logger = container.get('logger')

    const service = new PersistenceService()
    service.setLogger(logger)

    switch (config.database.provider) {
      case PersistenceService.PROVIDER_MYSQL: {
        const provider = new MySqlProvider()
        provider.setLogger(logger)
        provider.init({url: config.database.url})

        service.setProvider(provider)
      }
      break
    }

    return service
  })
}
