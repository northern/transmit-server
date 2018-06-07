
import PersistanceService from '../../App/Service/Persistance/PersistanceService'
import MySqlProvider from '../../App/Service/Persistance/Provider/MySqlProvider'

export default (bottle, config) => {
  bottle.factory('persistanceService', container => {
    const service = new PersistanceService()
    service.setLogger(container.logger)

    switch (config.storageType) {
      case 'mysql': {
        const provider = new MySqlProvider()
        provider.setLogger(container.logger)
        provider.init({url: config.databaseUrl})

        service.setProvider(provider)
      }
      break;
    }

    return service
  })
}
