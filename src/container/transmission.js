
import TransmissionService from '../App/Service/TransmissionService'
import TransmissionRepository from '../App/Service/TransmissionService/TransmissionRepository'

export default bottle => {
  bottle.factory('transmissionRepository', container => {
    const service = new TransmissionRepository()

    return service
  })

  bottle.factory('TransmissionService', container => {
    const service = new TransmissionService()
    service.setRepository(container.transmissionRepository)

    return service
  })
}
