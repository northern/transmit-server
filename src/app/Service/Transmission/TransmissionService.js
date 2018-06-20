
import Transmission from '../../Entity/Transmission'
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

  async create(message, revision, prioritizedChannels, connection) {
    let transmissions = []

    const targets = []

    message.data.recipients.map(recipient => {
      targets.push(this.helper.recipientToTransmissionTarget(recipient))
    })

    // Create the transmission for the "preferred" channels (should never be more than one).
    const channelsPreferred = this.helper.getPrioritizedChannels(revision.channels.preferred, prioritizedChannels);

    targets.map(target => {
      transmissions = transmissions.concat(this.helper.getTransmissions(message, target, channelsPreferred, true))
    })

    // Create the transmissions for the "required" channels.
    const channelsRequired  = this.helper.getPrioritizedChannels(revision.channels.required, prioritizedChannels);

    targets.map(target => {
      transmissions = transmissions.concat(this.helper.getTransmissions(message, target, channelsRequired, false))
    })

    // Persist the newly created transmissions.
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
