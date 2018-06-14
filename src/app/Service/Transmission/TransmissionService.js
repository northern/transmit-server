
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

  create(message, templateRevision, integrations, recipients, connection) {
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
      const transmission = new Transmission()
      transmission.messageId = message.id
      transmission.vars = recipient.vars
      
      if (recipient.email && providers.includes('email') && channels.includes('email')) {
        transmission.type = Transmission.TYPE_EMAIL
        transmission.target = recipient.email
      }

      if (recipient.phone && providers.includes('sms') && channels.includes('sms')) {
        transmission.type = Transmission.TYPE_SMS
        transmission.target = recipient.phone
      }

      if (recipient.push && providers.includes('push') && channels.includes('push')) {
        transmission.type = Transmission.TYPE_PUSH
        transmission.target = recipient.push
      }

      if (recipient.callback && providers.includes('callback') && channels.includes('callback')) {
        transmission.type = Transmission.TYPE_CALLBACK
        transmission.target = recipient.callback
      }

      if (recipient.chat && providers.includes('chat') && channels.includes('chat')) {
        transmission.type = Transmission.TYPE_CHAT
        transmission.target = recipient.chat
      }

      // If a transmission type and target where set then we can add this one
      // to the list and persist it.
      if (transmission.type && transmission.target) {
        transmissions.push(transmission)

        this.repository.persist(transmission, connection)
      }
    })

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

  send(message, transmission, integrations) {
    console.log("%o", message)
    console.log("%o", integrations)
    
  }
}
