
import Transmission from '../../Entity/Transmission'
import TransmissionTarget from '../../Entity/TransmissionTarget'
import TransmissionNotFoundError from './Error/TransmissionNotFoundError'
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

  setHelper(helper) {
    this.helper = helper
  }

  addProvider(provider) {
    this.providers.push(provider)
  }

  async getById(id, connection) {
    const transmission = await this.repository.getById(id, connection)

    if (!transmission) {
      throw new TransmissionNotFoundError(id)
    }

    return transmission
  }

  async create(message, revision, integrations, channels, connection) {
    const transmissions = []

    const targets = []

    message.data.recipients.map(recipient => {
      const target = new TransmissionTarget()
      target.email = recipient.email || null
      target.phone = recipient.phone || null
      target.push = recipient.push || null
      target.callback = recipient.callback || null
      target.chat = recipient.chat || null
      target.vars = recipient.vars || null
      
      targets.push(target)
    })

    // Providers is an array containing a list of channels for which providers
    // are configured (e.g. "email", "sms", etc.)
    const providers = integrations.map(integration => {
      return integration.channel
    })

    // Channels is an array containing a list of the channels set on a template
    // (e.g. "email", "sms", etc.)
    const combinedChannels = revision.channels.getCombined(channels)

    // Loop through all the targets and create Transmissions where a recipient
    // has a target specified (e.g. "email") and there is a provider to send to
    // that type of target (i.e. an email provider) and the channel ("email") is
    // specified on the template.
    targets.map(target => {
      if (target.email && providers.includes('email') && combinedChannels.includes('email')) {
        const transmission = new Transmission()
        transmission.messageId = message.id
        transmission.vars = target.vars
        transmission.channel = Transmission.CHANNEL_EMAIL
        transmission.target = target.email

        transmissions.push(transmission)
      }

      if (target.phone && providers.includes('sms') && combinedChannels.includes('sms')) {
        const transmission = new Transmission()
        transmission.messageId = message.id
        transmission.vars = target.vars
        transmission.channel = Transmission.CHANNEL_SMS
        transmission.target = target.phone

        transmissions.push(transmission)
      }

      if (target.push && providers.includes('push') && combinedChannels.includes('push')) {
        const transmission = new Transmission()
        transmission.messageId = message.id
        transmission.vars = target.vars
        transmission.channel = Transmission.CHANNEL_PUSH
        transmission.target = target.push

        transmissions.push(transmission)
      }

      if (target.callback && providers.includes('callback') && combinedChannels.includes('callback')) {
        const transmission = new Transmission()
        transmission.messageId = message.id
        transmission.vars = target.vars
        transmission.channel = Transmission.CHANNEL_CALLBACK
        transmission.target = target.callback

        transmissions.push(transmission)
      }

      if (target.chat && providers.includes('chat') && combinedChannels.includes('chat')) {
        const transmission = new Transmission()
        transmission.messageId = message.id
        transmission.vars = target.vars
        transmission.channel = Transmission.CHANNEL_CHAT
        transmission.target = target.chat

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

  async send(transmission, revision, integration, vars, defaults) {
    const combinedVars = this.helper.getCombinedVars(vars, transmission.vars)

    const title = this.helper.render(revision.getTitle(transmission.channel), combinedVars)
    const body = this.helper.render(revision.getBody(transmission.channel), combinedVars)

    let extra

    switch (transmission.channel) {
      case Transmission.CHANNEL_EMAIL: {
        const email = revision.email

        let alternateBody

        if (email.isHtml) {
          alternateBody = email.body.text || revision.default.body
        }
        else {
          alternateBody = email.body.html
        }

        extra = {
          to: transmission.target,
          from: `${email.getSenderName(defaults.sender.from)} <${email.getSenderEmail(defaults.sender.email)}>`,
          isHtml: email.isHtml,
          alternateBody: alternateBody ? this.helper.render(alternateBody, combinedVars) : null
        }
      }
      break
    }

    try {
      await integration.provider.send(title, body, extra)
    }
    catch(err) {
      console.error(err)
    }
  }

}
