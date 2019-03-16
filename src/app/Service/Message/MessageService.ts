
import ILogger from '../../ILogger'
import ObjectUtil from '../../Util/ObjectUtil'
import Message from '../../Entity/Message'
import Transmission from '../../Entity/Transmission'
import MessageRepository from './MessageRepository'
import MessageValidator from './MessageValidator'
import MessageNotFoundError from './Error/MessageNotFoundError'
import MessageValidationError from './Error/MessageValidationError'

export default class MessageService {
  static readonly PROVIDER_MYSQL: string = 'mysql'

  private logger: ILogger
  private repository: MessageRepository
  private validator: MessageValidator
  
  setLogger(logger: ILogger): void {
    this.logger = logger
  }

  setRepository(repository: MessageRepository): void {
    this.repository = repository
  }

  setValidator(validator: MessageValidator): void {
    this.validator = validator
  }

  async getById(id: string, connection: any): Promise<Message> {
    const message: Message = await this.repository.getById(id, connection)

    if (message === null) {
      throw new MessageNotFoundError(id)
    }

    return message
  }

  async create(data: object, environment: string, connection: any): Promise<Message> {
    const message: Message = new Message(data)
    message.environment = environment

    await this.repository.persist(message, connection)

    return message
  }

  async update(message: Message, values: object, connection: any): Promise<Message> {
    const filteredValues = ObjectUtil.filter(values, ['id', 'timeCreated', 'timeUpdated'])

    const updatedMessage = Object.assign(new Message(), message, filteredValues)

    const result = this.validator.validate(updatedMessage)

    const map: Map<string, any> = new Map(Object.entries(result))

    const errors = map.get('errors')

    if (errors && errors.length > 0) {
      throw new MessageValidationError(errors)
    }

    await this.repository.persist(updatedMessage, connection)

    return updatedMessage
  }

  getTemplateVars(_message: Message): object | null {
    let vars = null

    // if (message.template.vars instanceof Object) {
    //   vars = message.template.vars
    // }

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
  getCombinedStatus(transmissions: Array<Transmission>): string {
    let status: string = Message.STATUS_PROCESSING

    const stillProcessing: Transmission[] = transmissions.filter((t: Transmission) => 
      t.status === Transmission.STATUS_RETRY ||
      t.status === Transmission.STATUS_PENDING ||
      t.status === Transmission.STATUS_PROCESSING
    )

    if (stillProcessing.length === 0) {
      const failedCount: number = transmissions.filter((t: Transmission) => t.status === Transmission.STATUS_FAILED).length

      if (failedCount > 0) {
        if (failedCount === transmissions.length) {
          status = Message.STATUS_FAILED
        }
        else {
          status = Message.STATUS_WARNING
        }
      }
      else {
        status = Message.STATUS_OK
      }
    }

    return status
  }
}
