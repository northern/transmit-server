
import TransmissionService from '../../App/Service/Transmission/TransmissionService'
import TransmissionValidator from '../../App/Service/Transmission/TransmissionValidator'
import TransmissionRepository from '../../App/Service/Transmission/TransmissionRepository'
import MySqlRepository from '../../App/Service/Transmission/Repository/MySqlRepository'

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

  bottle.factory('transmissionValidator', container => {
    const service = new TransmissionValidator()
    service.setLogger(container.logger)
    service.setTemplateValidator(container.templateValidator)

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
