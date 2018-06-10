
import MessageService from '../../app/Service/Message/MessageService'
import MessageValidator from '../../app/Service/Message/MessageValidator'
import MessageRepository from '../../app/Service/Message/MessageRepository'
import MySqlStorage from '../../app/Service/Message/Storage/MySqlStorage'

export default (bottle) => {
  bottle.factory('messageRepository', container => {
    const { config } = container
    
    const service = new MessageRepository()
    service.setLogger(container.logger)

    switch (config.database.type) {
      case MessageService.TYPE_MYSQL: {
        const storage = new MySqlStorage()
        storage.setLogger(container.logger)

        service.setStorage(storage)
      }
      break;
    }

    return service
  })

  bottle.factory('messageValidator', container => {
    const service = new MessageValidator()
    service.setLogger(container.logger)

    return service
  })

  bottle.factory('messageService', container => {
    const service = new MessageService()
    service.setLogger(container.logger)
    service.setRepository(container.messageRepository)
    service.setValidator(container.messageValidator)

    return service
  })
}
