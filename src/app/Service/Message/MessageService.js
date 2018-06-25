
import Message from '../../Entity/Message'
import Transmission from '../../Entity/Transmission'
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

  getTemplateVars(message) {
    let vars = null

    if (message.template.vars instanceof Object) {
      vars = message.template.vars
    }

    return vars
  }

  /**
   * This method returns the Message status in accordance with the status of
   * each of the provided transmissions (pres. those accociated with message).
   *
   * As long as one or more transmissions are status RETRY, PROCESSING or
   * PENDING, this method returns status PROCESSING.
   * 
   * If all transmissions have received an OK status then we can set the status
   * of the message to OK.
   *
   * If all transmissions have recieved a FAILED status then we can set the
   * status of the message to FAILED.
   *
   * If one or more transmissions have received the status FAILED then we should
   * set the status of the message to WARNING.
   */
  getCombinedStatus(transmissions) {
    let failedCount = 0

    for (let i = 0; i < transmissions.length; i++) {
      const transmission = transmissions[i]

      switch (transmission.status) {
        case Transmission.STATUS_RETRY:
        case Transmission.STATUS_PENDING:
        case Transmission.STATUS_PROCESSING:
          return Message.STATUS_PROCESSING

        case Transmission.STATUS_FAILED:
          failedCount++
          break
      }
    }

    let status = Message.STATUS_OK

    if (failedCount > 0) {
      status = Message.STATUS_WARNING

      if (failedCount === transmissions.length) {
        status = Message.STATUS_FAILED
      }
    }
    
    return status
  }
}
