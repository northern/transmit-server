
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

  init(channels, providers) {
    const integrations = []

    Object.keys(channels).map(channel => {
      let provider

      switch (channels[channel]) {
        case 'aws':
          provider = new AwsProvider(providers.aws)
          break

        case 'sts':
          provider = new StsProvider(providers.sts)
          break

        case 'smtp':
          provider = new SmtpProvider(providers.smtp)
          break

        case 'http':
          provider = new HttpProvider(providers.http)
          break

        case 'slack':
          provider = new SlackProvider(providers.slack)
          break
      }

      integrations.push(
        new Integration(channel, provider)
      )
    })

    this.integrations = integrations
  }

  getIntegrations() {
    return this.integrations
  }

  getIntegration(channel) {
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
