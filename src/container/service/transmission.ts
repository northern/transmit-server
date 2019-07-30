
import Container from '../../util/Container'
import TransmissionService from '../../app/Service/Transmission/TransmissionService'
import TransmissionValidator from '../../app/Service/Transmission/TransmissionValidator'
import TransmissionRepository from '../../app/Service/Transmission/TransmissionRepository'
import MySqlStorage from '../../app/Service/Transmission/Storage/MySqlStorage'

export default async (container: Container) => {
  const config = container.get('config')
  const logger = container.get('logger')

  container.service('transmissionRepository', (container: Container) => {
    const service: TransmissionRepository = new TransmissionRepository()
    service.setLogger(logger)

    switch (config.database.provider) {
      case TransmissionService.PROVIDER_MYSQL: {
        const storage: MySqlStorage = new MySqlStorage()
        storage.setLogger(logger)

        service.setStorage(storage)
      }
      break;
    }

    return service
  })

  container.service('transmissionValidator', (container: Container) => {
    return new TransmissionValidator()
  })

  container.service('transmissionService', (container: Container) => {
    const service: TransmissionService = new TransmissionService()
    service.setLogger(logger)
    service.setRepository(container.get('transmissionRepository'))
    service.setValidator(container.get('transmissionValidator'))

    return service
  })
}
