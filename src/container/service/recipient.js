
import RecipientService from '../../app/Service/Recipient/RecipientService'

export default (container) => {
  const config = container.get('config')
  const logger = container.get('logger')

  container.service('recipientService', container => {
    const service = new RecipientService()
    service.setLogger(logger)

    return service
  })
}
