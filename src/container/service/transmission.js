
import TransmissionService from '../../app/Service/Transmission/TransmissionService'
import TransmissionValidator from '../../app/Service/Transmission/TransmissionValidator'
import TransmissionRepository from '../../app/Service/Transmission/TransmissionRepository'
import MySqlStorage from '../../app/Service/Transmission/Storage/MySqlStorage'

export default (container) => {
  const config = container.get('config')
  const logger = container.get('logger')

  container.service('transmissionRepository', container => {
    const service = new TransmissionRepository()
    service.setLogger(logger)

    switch (config.database.provider) {
      case TransmissionService.PROVIDER_MYSQL: {
        const storage = new MySqlStorage()
        storage.setLogger(logger)

        service.setStorage(storage)
      }
      break;
    }

    return service
  })

  container.service('transmissionValidator', container => {
    const service = new TransmissionValidator()
    service.setLogger(logger)

    return service
  })

  container.service('transmissionService', container => {
    const service = new TransmissionService()
    service.setLogger(logger)
    service.setRepository(container.get('transmissionRepository'))
    service.setValidator(container.get('transmissionValidator'))

    return service
  })
}
