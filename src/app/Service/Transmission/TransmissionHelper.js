
import _ from 'lodash'
import Twig from 'twig'

import Template from '../../Entity/Template'
import Transmission from '../../Entity/Transmission'
import TransmissionTarget from '../../Entity/TransmissionTarget'

export default class TransmissionHelper {
  static get CHANNEL_PREFERRED() {
    return 'preferred'
  }

  static get CHANNEL_REQUIRED() {
    return 'required'
  }

  /**
   * Takes two Objects and combines them. If the resulting Object does not contain any keys
   * then 'null' will be returned.
   *
   * @param Object templateVars
   * @param Object transmissionVars
   * @return Object | null
   */
  getCombinedVars(templateVars, transmissionVars) {
    let combinedVars = Object.assign({}, templateVars || {}, transmissionVars || {})

    if (Object.keys(combinedVars).length === 0) {
      combinedVars = null
    }

    return combinedVars    
  }

  /**
   * Convert a recipient data structure into a TransmissionTarget.
   *
   * @param Object recipient
   * @return TransmissionTarget
   */
  recipientToTransmissionTarget(recipient) {
    const target = new TransmissionTarget()

    target.email    = recipient.email    || null
    target.phone    = recipient.phone    || null
    target.push     = recipient.push     || null
    target.callback = recipient.callback || null
    target.chat     = recipient.chat     || null
    target.vars     = recipient.vars     || null

    return target
  }

  /**
   * Returns a list of channels based on the channels set on a template and any potential
   * channel overrides supplied in a message. E.g. a template might have defined the
   * 'email' and 'sms' as the preferred channels. However, the prioritizedChannels parameter
   * can onverride this, e.g. to remove the 'sms' channel from the preferred channels. If
   * the prioritized channel contains only 'email' then the 'sms' channel will be removed
   * from the preferred channels.
   *
   * @param array templateChannels An array of channels defined on the template.
   * @param array prioritizedChannels An array of prioritized channels (or NULL).
   * @return array
   */
  getPrioritizedChannels(templateChannels, prioritizedChannels = null) {
    // By default we simply return the templateChannels.
    let channels = templateChannels;

    if (prioritizedChannels !== null && prioritizedChannels.length > 0) {
        // If prioritizedChannels was defined then we clear the channel to refill it.
        channels = [];

        prioritizedChannels.map(prioritizedChannel => {
            // If the prioritized channel is in the template channels we can use it.
          if (templateChannels.includes(prioritizedChannel)) {
            channels.push(prioritizedChannel)
          }
        })
    }

    return channels;
  }

  /**
   * Returns a list of Transmissions based on a TransmissionTarget and a list of channels.
   * When looping through the provided channels, when a "match" is found then a Transmission
   * will be created. E.g. if the channel is "email" and the target has the "email" set then
   * a new Transmission will be created.
   *
   * The isPreferred parameter refers to "preferred" channels and when set to "true" it means
   * that after a first "match" is found, the loop will exist.
   *
   * @param TransmissionTarget target
   * @param array channels
   * @param boolean isPreferred
   */
  getTransmissions(target, channels, channelType, capabilities) {
    const transmissions = []

    for (let i = 0; i < channels.length; i++) {
      const channel = channels[i]

      // If the channel is not included in the capabilities then we skip..
      if (!capabilities.includes(channel)) {
        continue
      }

      // Create a Transmission for the specified channel.
      switch (channel) {
        case Template.CHANNEL_TYPE_EMAIL:
          if (target.email) {
            const transmission = new Transmission()
            transmission.vars = target.vars
            transmission.channel = Transmission.CHANNEL_EMAIL
            transmission.target = target.email

            transmissions.push(transmission)
          }
          break

        case Template.CHANNEL_TYPE_SMS:
          if (target.phone) {
            const transmission = new Transmission()
            transmission.vars = target.vars
            transmission.channel = Transmission.CHANNEL_SMS
            transmission.target = String(target.phone)

            transmissions.push(transmission)
          }
          break

        case Template.CHANNEL_TYPE_PUSH:
          if (target.push) {
            const transmission = new Transmission()
            transmission.vars = target.vars
            transmission.channel = Transmission.CHANNEL_PUSH
            transmission.target = target.push

            transmissions.push(transmission)
          }
          break

        case Template.CHANNEL_TYPE_CALLBACK:
          if (target.callback) {
            const transmission = new Transmission()
            transmission.vars = target.vars
            transmission.channel = Transmission.CHANNEL_CALLBACK
            transmission.target = target.callback

            transmissions.push(transmission)
          }
          break

        case Template.CHANNEL_TYPE_CHAT:
          if (target.chat) {
            const transmission = new Transmission()
            transmission.vars = target.vars
            transmission.channel = Transmission.CHANNEL_CHAT
            transmission.target = target.chat

            transmissions.push(transmission)
          }
          break
      }

      if (transmissions.length > 0 && channelType === TransmissionHelper.CHANNEL_PREFERRED) {
        break
      }
    }

    return transmissions
  }

  /**
   * Get the capabilities, i.e. the channels for which we can actually send
   * something out. Imagine we want to send an SMS but none of the integration
   * providers supports sending SMS messages, in that scenario we do not want
   * to create a transmission.
   */
  getUniqueCapabilities(integrations) {
    let capabilities = []

    integrations.map(integration => {
      capabilities = capabilities.concat(integration.provider.getCapabilities())
    })

    capabilities = _.uniq(capabilities)

    return capabilities    
  }

  render(source, vars) {
    const template = Twig.twig({
      data: source
    })

    return template.render(vars)
  }
}
