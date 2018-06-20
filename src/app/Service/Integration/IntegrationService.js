
import Integration from '../../Entity/Integration'
import AwsProvider from './Provider/AwsProvider'
import StsProvider from './Provider/StsProvider'
import SmtpProvider from './Provider/SmtpProvider'
import HttpProvider from './Provider/HttpProvider'
import SlackProvider from './Provider/SlackProvider'

export default class IntegrationService {
  setLogger(logger) {
    this.logger = logger
  }

  init(channels, settings) {
    const integrations = []
    const providers = {}

    Object.keys(channels).map(channel => {
      const type = channels[channel]

      switch (type) {
        case 'aws':
          if (!providers[type]) {
            providers[type] = new AwsProvider(settings.aws)
          }
          break

        case 'sts':
          if (!providers[type]) {
            providers[type] = new StsProvider(settings.sts)
          }
          break

        case 'smtp':
          if (!providers[type]) {
            providers[type] = new SmtpProvider(settings.smtp)
          }
          break

        case 'http':
          if (!providers[type]) {
            providers[type] = new HttpProvider(settings.http)
          }
          break

        case 'slack':
          if (!providers[type]) {
            providers[type] = new SlackProvider(settings.slack)
          }
          break
      }

      integrations.push(
        new Integration(channel, providers[type])
      )
    })

    this.integrations = integrations
  }

  async getIntegrations(connection) {
    return this.integrations
  }

  async getIntegration(channel, connection) {
    const integrations = this.integrations.filter(integration => {
      if (integration.channel === channel) {
        return integration
      }
    })

    if (integrations.length !== 1) {
      // TODO: Needs proper exception
      throw new Error("Missing integration")
    }

    return integrations[0]
  }
}
