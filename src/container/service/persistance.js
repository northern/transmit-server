
import PersistenceService from '../../app/Service/Persistence/PersistenceService'
import MySqlProvider from '../../app/Service/Persistence/Provider/MySqlProvider'

export default (bottle) => {
  bottle.factory('persistenceService', container => {
    const { config } = container

    const service = new PersistenceService()
    service.setLogger(container.logger)

    switch (config.database.type) {
      case PersistenceService.TYPE_MYSQL: {
        const provider = new MySqlProvider()
        provider.setLogger(container.logger)
        provider.init({url: config.database.url})

        service.setProvider(provider)
      }
      break;
    }

    return service
  })
}
