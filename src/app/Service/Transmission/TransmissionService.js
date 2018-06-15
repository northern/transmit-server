
import Transmission from '../../Entity/Transmission'
import TransmissionValidationError from './Error/TransmissionValidationError'

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

  async getById(id, connection) {
    return this.repository.getById(id, connection)
  }

  async create(message, templateRevision, integrations, recipients, connection) {
    const transmissions = []

    // Providers is an array containing a list of channels for which providers
    // are configured (e.g. "email", "sms", etc.)
    const providers = integrations.map(integration => {
      return integration.channel
    })

    // Channels is an array containing a list of the channels set on a template
    // (e.g. "email", "sms", etc.)
    const channels = templateRevision.channels.getCombined()

    // Loop through all the recipients and create Transmissions where a recipient
    // has a target specified (e.g. "email") and there is a provider to send to
    // that type of target (i.e. an email provider) and the channel ("email") is
    // specified on the template.
    recipients.map(recipient => {
      if (recipient.email && providers.includes('email') && channels.includes('email')) {
        const transmission = new Transmission()
        transmission.messageId = message.id
        transmission.vars = recipient.vars
        transmission.channel = Transmission.CHANNEL_EMAIL
        transmission.target = recipient.email

        transmissions.push(transmission)
      }

      if (recipient.phone && providers.includes('sms') && channels.includes('sms')) {
        const transmission = new Transmission()
        transmission.messageId = message.id
        transmission.vars = recipient.vars
        transmission.channel = Transmission.CHANNEL_SMS
        transmission.target = recipient.phone

        transmissions.push(transmission)
      }

      if (recipient.push && providers.includes('push') && channels.includes('push')) {
        const transmission = new Transmission()
        transmission.messageId = message.id
        transmission.vars = recipient.vars
        transmission.channel = Transmission.CHANNEL_PUSH
        transmission.target = recipient.push

        transmissions.push(transmission)
      }

      if (recipient.callback && providers.includes('callback') && channels.includes('callback')) {
        const transmission = new Transmission()
        transmission.messageId = message.id
        transmission.vars = recipient.vars
        transmission.channel = Transmission.CHANNEL_CALLBACK
        transmission.target = recipient.callback

        transmissions.push(transmission)
      }

      if (recipient.chat && providers.includes('chat') && channels.includes('chat')) {
        const transmission = new Transmission()
        transmission.messageId = message.id
        transmission.vars = recipient.vars
        transmission.channel = Transmission.CHANNEL_CHAT
        transmission.target = recipient.chat

        transmissions.push(transmission)
      }
    })

    for (var i = 0; i < transmissions.length; i++) {
      await this.repository.persist(transmissions[i], connection)
    }

    return transmissions
  }

  async update(transmission, values, connection) {
    const updatedTransmission = Object.assign(new Transmission(), transmission, values)

    const result = this.validator.validate(transmission)

    if (result.errors.length > 0) {
      throw new TransmissionValidationError(result.errors)
    }

    await this.repository.persist(updatedTransmission, connection)

    return updatedTransmission
  }

  send(transmission, templateRevision, integration) {
    //console.log("%o", templateRevision)
    //console.log("%o", transmission)
    //console.log("%o", integrations)
    
  }
}
