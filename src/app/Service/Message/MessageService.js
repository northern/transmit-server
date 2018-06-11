
import Message from '../../Entity/Message'
import MessageValidationError from './Error/MessageValidationError'

export default class MessageService {
  static get PROVIDER_MYSQL() {
    return 'mysql'
  }
  
  setLogger(logger) {
    this.logger = logger
  }

  setRepository(repository) {
    this.repository = repository
  }

  setValidator(validator) {
    this.validator = validator
  }

  async getById(id, connection) {
    return this.repository.getById(id, connection)
  }

  async create(data, connection) {
    const message = new Message(data)

    const result = this.validator.validate(message)

    if (result.errors.length > 0) {
      throw new MessageValidationError(result.errors)
    }

    await this.repository.persist(message, connection)

    return message
  }

  async update(message, values, connection) {
    const updatedMessage = Object.assign(new Message(), message, values)

    const result = this.validator.validate(message)

    if (result.errors.length > 0) {
      throw new MessageValidationError(result.errors)
    }

    await this.repository.persist(updatedMessage, connection)

    return updatedMessage
  }
}
