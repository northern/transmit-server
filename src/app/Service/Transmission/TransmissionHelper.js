
import Twig from 'twig'

import Template from '../../Entity/Template'
import Transmission from '../../Entity/Transmission'
import TransmissionTarget from '../../Entity/TransmissionTarget'

export default class TransmissionHelper {
  getCombinedVars(templateVars, transmissionVars) {
    let combinedVars = Object.assign({}, templateVars || {}, transmissionVars || {})

    if (Object.keys(combinedVars).length === 0) {
      combinedVars = null
    }

    return combinedVars    
  }

  recipientToTransmissionTarget(recipient) {
    const target = new TransmissionTarget()
    target.email = recipient.email || null
    target.phone = recipient.phone || null
    target.push = recipient.push || null
    target.callback = recipient.callback || null
    target.chat = recipient.chat || null
    target.vars = recipient.vars || null

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

  getTransmissions(message, target, channels, isPreferred = true) {
    const transmissions = []

    for (let i = 0; i < channels.length; i++) {
      switch (channels[i]) {
        case Template.CHANNEL_TYPE_EMAIL:
          if (target.email) {
            const transmission = new Transmission()
            transmission.messageId = message.id
            transmission.vars = target.vars
            transmission.channel = Transmission.CHANNEL_EMAIL
            transmission.target = target.email

            transmissions.push(transmission)
          }
          break

        case Template.CHANNEL_TYPE_SMS:
          if (target.phone) {
            const transmission = new Transmission()
            transmission.messageId = message.id
            transmission.vars = target.vars
            transmission.channel = Transmission.CHANNEL_SMS
            transmission.target = target.phone

            transmissions.push(transmission)
          }
          break

        case Template.CHANNEL_TYPE_PUSH:
          if (target.push) {
            const transmission = new Transmission()
            transmission.messageId = message.id
            transmission.vars = target.vars
            transmission.channel = Transmission.CHANNEL_PUSH
            transmission.target = target.push

            transmissions.push(transmission)
          }
          break

        case Template.CHANNEL_TYPE_CALLBACK:
          if (target.callback) {
            const transmission = new Transmission()
            transmission.messageId = message.id
            transmission.vars = target.vars
            transmission.channel = Transmission.CHANNEL_CALLBACK
            transmission.target = target.callback

            transmissions.push(transmission)
          }
          break

        case Template.CHANNEL_TYPE_CHAT:
          if (target.chat) {
            const transmission = new Transmission()
            transmission.messageId = message.id
            transmission.vars = target.vars
            transmission.channel = Transmission.CHANNEL_CHAT
            transmission.target = target.chat

            transmissions.push(transmission)
          }
          break
      }

      if (transmissions.length > 0 && isPreferred) {
        break
      }
    }

    return transmissions
  }

  render(source, vars) {
    const template = Twig.twig({
      data: source
    })

    return template.render(vars)
  }
}
