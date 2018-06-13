
import Transmission from '../../Entity/Transmission'

export default class TransmissionService {
  static get PROVIDER_MYSQL() {
    return 'mysql'
  }
 
  constructor() {
    this.providers = []
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

  addProvider(provider) {
    this.providers.push(provider)
  }

  create(message, template, integrations, recipients, connection) {
    const transmissions = []

    recipients.map(recipient => {
      if (recipient.email) {
        const transmission = new Transmission()
        transmission.messageId = message.id
        transmission.type = Transmission.TYPE_EMAIL
        transmission.target = recipient.email
        transmission.vars = recipient.vars

        transmissions.push(transmission)
      }
      else
      if (recipient.phone) {
        const transmission = new Transmission()
        transmission.messageId = message.id
        transmission.type = Transmission.TYPE_SMS
        transmission.target = recipient.phone
        transmission.vars = recipient.vars

        transmissions.push(transmission)
      }
      else
      if (recipient.push) {
        const transmission = new Transmission()
        transmission.messageId = message.id
        transmission.type = Transmission.TYPE_PUSH
        transmission.target = recipient.push
        transmission.vars = recipient.vars

        transmissions.push(transmission)
      }
      else
      if (recipient.callback) {
        const transmission = new Transmission()
        transmission.messageId = message.id
        transmission.type = Transmission.TYPE_CALLBACK
        transmission.target = recipient.callback
        transmission.vars = recipient.vars

        transmissions.push(transmission)
      }
      else
      if (recipient.chat) {
        const transmission = new Transmission()
        transmission.messageId = message.id
        transmission.type = Transmission.TYPE_CHAT
        transmission.target = recipient.chat
        transmission.vars = recipient.vars

        transmissions.push(transmission)
      }
    })

    transmissions.map(transmission => {
      this.repository.persist(transmission, connection)
    })

    return transmissions
  }

  send(transmission) {
    
  }
}
