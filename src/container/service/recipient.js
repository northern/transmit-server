
import RecipientService from '../../app/Service/Recipient/RecipientService'

export default (bottle) => {
  bottle.factory('recipientService', container => {
    const { config } = container

    const service = new RecipientService()
    service.setLogger(container.logger)

    return service
  })
}
