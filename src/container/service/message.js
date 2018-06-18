
import MessageService from '../../app/Service/Message/MessageService'
import MessageValidator from '../../app/Service/Message/MessageValidator'
import MessageRepository from '../../app/Service/Message/MessageRepository'
import MySqlStorage from '../../app/Service/Message/Storage/MySqlStorage'

export default async (container) => {
  const config = container.get('config')
  const logger = container.get('logger')

  container.service('messageRepository', container => {
    const service = new MessageRepository()
    service.setLogger(logger)

    switch (config.database.provider) {
      case MessageService.PROVIDER_MYSQL: {
        const storage = new MySqlStorage()
        storage.setLogger(logger)

        service.setStorage(storage)
      }
      break;
    }

    return service
  })

  container.service('messageValidator', container => {
    const service = new MessageValidator()
    service.setLogger(logger)
    service.setTemplateValidator(container.get('templateValidator'))

    return service
  })

  container.service('messageService', container => {
    const service = new MessageService()
    service.setLogger(logger)
    service.setRepository(container.get('messageRepository'))
    service.setValidator(container.get('messageValidator'))

    return service
  })
}
