
import TransmissionService from '../../app/Service/Transmission/TransmissionService'
import TransmissionValidator from '../../app/Service/Transmission/TransmissionValidator'
import TransmissionRepository from '../../app/Service/Transmission/TransmissionRepository'
import MySqlStorage from '../../app/Service/Transmission/Storage/MySqlStorage'

export default (bottle) => {
  bottle.factory('transmissionRepository', container => {
    const { config } = container
    
    const service = new TransmissionRepository()
    service.setLogger(container.logger)

    switch (config.database.type) {
      case TransmissionService.TYPE_MYSQL: {
        const storage = new MySqlStorage()
        storage.setLogger(container.logger)

        service.setStorage(storage)
      }
      break;
    }

    return service
  })

  bottle.factory('transmissionValidator', container => {
    const service = new TransmissionValidator()
    service.setLogger(container.logger)

    return service
  })

  bottle.factory('transmissionService', container => {
    const service = new TransmissionService()
    service.setLogger(container.logger)
    service.setRepository(container.transmissionRepository)
    service.setValidator(container.transmissionValidator)

    return service
  })
}
