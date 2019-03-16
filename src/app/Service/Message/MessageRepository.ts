
import ILogger from '../../ILogger'
import Message from '../../Entity/Message'

export default class MessageRepository {
  private logger: ILogger
  private storage: any

  setLogger(logger: ILogger) {
    this.logger = logger
  }

  setStorage(storage: any) {
    this.storage = storage
  }

  async getById(id: string, connection: any): Promise<Message> {
    return this.storage.getById(id, connection)
  }

  async persist(message: Message, connection: any): Promise<Message> {
    return await this.storage.persist(message, connection)
  }
}
