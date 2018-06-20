
import Template from '../../Entity/Template'
import TransmissionHelper from './TransmissionHelper'

describe('testGetPrioritizedChannels', () => {
  const transmissionHelper = new TransmissionHelper()

  const templateChannels = [
    Template.CHANNEL_TYPE_EMAIL,
    Template.CHANNEL_TYPE_PUSH,
    Template.CHANNEL_TYPE_SMS
  ]

  it("should return the same channels when no priority channels are provided", () => {
    let channels

    channels = transmissionHelper.getPrioritizedChannels(templateChannels)
    expect(channels).toEqual(templateChannels)

    channels = transmissionHelper.getPrioritizedChannels(templateChannels, [])
    expect(channels).toEqual(templateChannels)
  })

  it("should return the 'email' priority channel when provided", () => {
    let channels

    channels = transmissionHelper.getPrioritizedChannels(templateChannels, [
      Template.CHANNEL_TYPE_EMAIL
    ])
    expect(channels).toEqual([Template.CHANNEL_TYPE_EMAIL])
  })

  it("should return both 'sms' and 'push' priority channels when provided", () => {
    let channels

    channels = transmissionHelper.getPrioritizedChannels(templateChannels, [
      Template.CHANNEL_TYPE_SMS,
      Template.CHANNEL_TYPE_PUSH
    ])
    expect(channels).toEqual([Template.CHANNEL_TYPE_SMS, Template.CHANNEL_TYPE_PUSH])
  })

  it("should return no channels if the priority channel does not exist on the template", () => {
    let channels

    channels = transmissionHelper.getPrioritizedChannels([
        Template.CHANNEL_TYPE_SMS,
        Template.CHANNEL_TYPE_PUSH
      ], [
        Template.CHANNEL_EMAIL
      ]
    )
    expect(channels).toEqual([])
  })
})
