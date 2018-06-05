
import TransmissionService from '../App/Service/Transmission/TransmissionService'
import TransmissionRepository from '../App/Service/Transmission/TransmissionRepository'
import MySqlRepository from '../App/Service/Transmission/Repository/MySqlRepository'

export default bottle => {
  bottle.factory('transmissionMySqlRepository', container => {
    const service = new MySqlRepository()
    service.setLogger(container.logger)

    return service
  })

  bottle.factory('transmissionRepository', container => {
    const service = new TransmissionRepository()
    service.setLogger(container.logger)
    service.setRepository(container.transmissionMySqlRepository)

    return service
  })

  bottle.factory('transmissionService', container => {
    const service = new TransmissionService()
    service.setLogger(container.logger)
    service.setRepository(container.transmissionRepository)

    return service
  })
}
