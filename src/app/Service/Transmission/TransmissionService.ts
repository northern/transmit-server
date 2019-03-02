
import _ from 'lodash'

import ILogger from '../../ILogger'
import Message from '../../Entity/Message'
import Transmission from '../../Entity/Transmission'
import TransmissionTarget from '../../Entity/TransmissionTarget'
import TemplateRevision from '../../Entity/Template/Revision'
import Integration from '../../Entity/Integration'
import TransmissionUtil from './TransmissionUtil'
import TransmissionRepository from './TransmissionRepository'
import TransmissionValidator from './TransmissionValidator'
import TransmissionNotFoundError from './Error/TransmissionNotFoundError'
import TransmissionValidationError from './Error/TransmissionValidationError'

export default class TransmissionService {
  static readonly PROVIDER_MYSQL    = 'mysql'
  static readonly PROVIDER_POSTGRES = 'postgres'
  static readonly PROVIDER_MONGO    = 'mongo'
 
  private logger: ILogger
  private repository: TransmissionRepository
  private validator: TransmissionValidator
  private util: TransmissionUtil

  setLogger(logger: ILogger): void {
    this.logger = logger
  }

  setRepository(repository: TransmissionRepository): void {
    this.repository = repository
  }

  setValidator(validator: TransmissionValidator): void {
    this.validator = validator
  }

  setUtil(util: TransmissionUtil): void {
    this.util = util
  }

  async getById(id: string, connection: any): Promise<Transmission> {
    const transmission = await this.repository.getById(id, connection)

    if (!transmission) {
      throw new TransmissionNotFoundError(id)
    }

    return transmission
  }

  async getByMessageId(id: string, connection: any): Promise<Transmission[]> {
    return this.repository.getByMessageId(id, connection)
  }

  /**
   * Returns a list of Transmissions based on the Message and the provided 
   * Revision (Template). The Message will contain a list of recipients, these 
   * will be transformed into TransmissionTargets. 
   * Based on the TransmissionTargets the Transmissions will be created. The 
   * Revision will normally define the channels over which the transmission will
   * be send (preferred and required channels). However, the prioritizedChannels
   * can override these defaults.
   *
   * @param Message message
   * @param Revision revision of the template
   * @param array prioritizedChannels
   * @param Object connection
   */
  async create(message: Message, revision: TemplateRevision, prioritizedChannels: Array<any>, integrations: Array<Integration>, connection: any): Promise<Transmission[]> {
    let transmissions: Transmission[] = []

    // Get the capabilities, i.e. the channels for which we can actually send
    // something out. Imagine we want to send an SMS but none of the integration
    // providers supports sending SMS messages, in that scenario we do not want
    // to create a transmission.
    const capabilities: string[] = this.util.getUniqueCapabilities(integrations)

    // Turn the recipients into TransmissionTarget's.
    const targets: TransmissionTarget[] = []

    if (message.data) {
      const map: Map<string, any> = new Map(Object.entries(message.data))

      const recipients = map.get('recipients')

      if (recipients) {
        recipients.map((recipient: object) => {
          targets.push(this.util.recipientToTransmissionTarget(recipient))
        })
      }
    }

    let channels: Array<string>

    // Create the transmission for the "preferred" channels (should never be more than one).
    channels = this.util.getPrioritizedChannels(revision.channels.preferred, prioritizedChannels);

    targets.map(target => {
      transmissions = transmissions.concat(
        this.util.getTransmissions(target, channels, TransmissionUtil.CHANNEL_PREFERRED, capabilities)
      )
    })

    // Create the transmissions for the "required" channels.
    channels = this.util.getPrioritizedChannels(revision.channels.required, prioritizedChannels);

    targets.map(target => {
      transmissions = transmissions.concat(
        this.util.getTransmissions(target, channels, TransmissionUtil.CHANNEL_REQUIRED, capabilities)
      )
    })

    // Persist the newly created transmissions.
    for (var i = 0; i < transmissions.length; i++) {
      transmissions[i].messageId = message.id

      await this.repository.persist(transmissions[i], connection)
    }

    return transmissions
  }

  /*async update(transmission: Transmission, values: object, connection: any) {
    const updatedTransmission: Transmission = Object.assign(new Transmission(), transmission, values)

    const result = this.validator.validate(updatedTransmission)

    if (result.errors.length > 0) {
      throw new TransmissionValidationError(result.errors)
    }

    await this.repository.persist(updatedTransmission, connection)

    return updatedTransmission
  }*/

  /*async send(transmission, revision, integration, vars, defaults) {
    const combinedVars = this.util.getCombinedVars(vars, transmission.vars)

    const title = this.util.render(revision.getTitle(transmission.channel), combinedVars)
    const body = this.util.render(revision.getBody(transmission.channel), combinedVars)

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
          alternateBody: alternateBody ? this.util.render(alternateBody, combinedVars) : null
        }
      }
      break

      case Transmission.CHANNEL_SMS: {
        extra = {
          phone: transmission.target,
          senderId: defaults.sender.id,
        }
      }
      break
    }

    try {
      await integration.provider.send(transmission.channel, title, body, extra)
    }
    catch (err) {
      // TODO: Normalize error
      throw new Error(err)
    }
  }*/
}
