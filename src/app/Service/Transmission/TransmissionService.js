
import Transmission from '../../Entity/Transmission'
import TransmissionHelper from './TransmissionHelper'
import TransmissionNotFoundError from './Error/TransmissionNotFoundError'
import TransmissionValidationError from './Error/TransmissionValidationError'

export default class TransmissionService {
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

  setHelper(helper) {
    this.helper = helper
  }

  async getById(id, connection) {
    const transmission = await this.repository.getById(id, connection)

    if (!transmission) {
      throw new TransmissionNotFoundError(id)
    }

    return transmission
  }

  /**
   * Returns a list of Transmissions based on the Message and the provided Revision (Template). The
   * Message will contain a list of recipients, these will be transformed into TransmissionTargets.
   * Based on the TransmissionTargets the Transmissions will be created.
   * The Revision will normally define the channels over which the transmission will be send (preferred
   * and required channels). However, the prioritizedChannels can override these defaults.
   *
   * @param Message message
   * @param Revision revision
   * @param array prioritizedChannels
   * @param Object connection
   */
  async create(message, revision, prioritizedChannels, connection) {
    let transmissions = []

    const targets = []

    message.data.recipients.map(recipient => {
      targets.push(this.helper.recipientToTransmissionTarget(recipient))
    })

    // Create the transmission for the "preferred" channels (should never be more than one).
    const channelsPreferred = this.helper.getPrioritizedChannels(revision.channels.preferred, prioritizedChannels);

    targets.map(target => {
      transmissions = transmissions.concat(this.helper.getTransmissions(target, channelsPreferred, TransmissionHelper.CHANNEL_PREFERRED))
    })

    // Create the transmissions for the "required" channels.
    const channelsRequired  = this.helper.getPrioritizedChannels(revision.channels.required, prioritizedChannels);

    targets.map(target => {
      transmissions = transmissions.concat(this.helper.getTransmissions(target, channelsRequired, TransmissionHelper.CHANNEL_REQUIRED))
    })

    // Persist the newly created transmissions.
    for (var i = 0; i < transmissions.length; i++) {
      transmissions[i].messageId = message.id

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

        const fromEmail = email.getSenderEmail(defaults.sender.email)
        const fromName = email.getSenderName(defaults.sender.from)

        extra = {
          to: transmission.target,
          from: fromName ? `${fromName} <${fromEmail}>` : fromEmail,
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
