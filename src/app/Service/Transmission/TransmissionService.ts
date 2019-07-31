
import _ from 'lodash'

import ILogger from '../../ILogger'
import Message from '../../Entity/Message'
import Transmission from '../../Entity/Transmission'
import TransmissionTarget from '../../Entity/TransmissionTarget'
import TemplateRevision from '../../Entity/Template/Revision'
import Email from '../../Entity/Template/Revision/Email'
import TemplateDefaults from '../../Entity/Template/Revision/Defaults'
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
    const transmission: Transmission | null = await this.repository.getById(id, connection)

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
   * template revision (Revision). The Message will contain a list of recipients,
   * these will be transformed into TransmissionTargets. 
   * Based on the TransmissionTargets the Transmissions will be created. The 
   * template will normally define the channels over which the transmission will
   * be send (preferred and required channels). However, the prioritizedChannels
   * can override these defaults.
   * The Integrations are required as an extra filter. E.g. if there is no
   * integration to handle a specific channel, the transmission will not be
   * created.
   *
   * @param Message message
   * @param Revision revision of the template
   * @param array prioritizedChannels
   * @param Object connection
   */
  async create(message: Message, templateRevision: TemplateRevision, integrations: Array<Integration>, prioritizedChannels: Array<any>, connection: any): Promise<Transmission[]> {
    let transmissions: Transmission[] = []

    // Get the capabilities of the integrations, i.e. the channels for which we 
    // can actually process transmissions. Imagine we want to send an SMS but none 
    // of the integration providers supports sending SMS messages, in that scenario
    // we do not want to create a transmission for that channel.
    const capabilities: string[] = this.util.getIntegrationCapabilities(integrations)

    // Turn the recipients into TransmissionTarget's.
    const targets: TransmissionTarget[] = []

    if (message.data) {
      const map: Map<string, any> = new Map(Object.entries(message.data))

      // Recipients are transient, in that they only exist in the message payload.
      const recipients: object[] = map.get('recipients')

      if (recipients) {
        recipients.map((recipient: object) => {
          targets.push(this.util.recipientToTransmissionTarget(recipient))
        })
      }
    }

    let channels: string[]

    // Create the transmission for the "preferred" channels (should never be more than one).
    channels = this.util.getPrioritizedChannels(templateRevision.channels.preferred, prioritizedChannels);

    targets.map((target: TransmissionTarget) => {
      transmissions = transmissions.concat(
        this.util.createTransmissions(message, target, channels, TransmissionUtil.CHANNEL_PREFERRED, capabilities)
      )
    })

    // Create the transmissions for the "required" channels.
    channels = this.util.getPrioritizedChannels(templateRevision.channels.required, prioritizedChannels);

    targets.map((target: TransmissionTarget) => {
      transmissions = transmissions.concat(
        this.util.createTransmissions(message, target, channels, TransmissionUtil.CHANNEL_REQUIRED, capabilities)
      )
    })

    // Persist the newly created transmissions.
    for (let transmission of transmissions) {
      transmission = await this.repository.persist(transmission, connection)
    }

    return transmissions
  }

  async update(transmission: Transmission, values: object, connection: any): Promise<Transmission> {
    const updatedTransmission: Transmission = Object.assign(
      new Transmission(transmission.messageId, transmission.channel), transmission, values
    )

    const result: object = this.validator.validate(updatedTransmission)

    const map: Map<string, any> = new Map(Object.entries(result))

    const errors: any[] = map.get('errors')

    if (errors.length > 0) {
      throw new TransmissionValidationError(errors)
    }

    await this.repository.persist(updatedTransmission, connection)

    return updatedTransmission
  }

  async send(transmission: Transmission, templateRevision: TemplateRevision, integration: Integration, vars: object, senderDefaults: Map<string, any>): Promise<void> {
    const combinedVars: object = this.util.getCombinedVars(vars, transmission.vars || {})

    const title: string = await this.util.render(templateRevision.getTitle(transmission.channel), combinedVars)
    const body: string = await this.util.render(templateRevision.getBody(transmission.channel), combinedVars)

    let extra: object | null = null

    switch (transmission.channel) {
      case Transmission.CHANNEL_EMAIL: {
        const email: Email = templateRevision.email

        let alternateBody: string = ''

        if (email.isHtml) {
          alternateBody = email.body.text || templateRevision.defaults.body
        }

        const fromEmail: string = email.getSenderEmail(senderDefaults.get('email'))
        const fromName: string = email.getSenderName(senderDefaults.get('from'))

        extra = {
          to: transmission.target,
          from: fromName && fromName.length > 0 ? `${fromName} <${fromEmail}>` : fromEmail,
          isHtml: email.isHtml,
          alternateBody: alternateBody ? this.util.render(alternateBody, combinedVars) : null
        }
      }
      break

      case Transmission.CHANNEL_SMS: {
        extra = {
          phone: transmission.target,
          senderId: senderDefaults.get('id'),
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
  }
}
