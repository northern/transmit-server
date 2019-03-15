
import Integration from './Integration'
import IProvider from './Integration/IProvider'

class MockProvider implements IProvider {
  getCapabilities(): Array<string> {
    return [Integration.CHANNEL_EMAIL, Integration.CHANNEL_PUSH]
  }

  async send(_channel: string, _title: string, _body: string, _extra: object | null): Promise<void> {
  }
}

describe('Entity/Integration', () => {
  it("should instantiate with constructor parameters", () => {
    const mockProvider = new MockProvider()

    const integration: Integration = new Integration(Integration.CHANNEL_EMAIL, mockProvider)

    expect(integration).toBeInstanceOf(Integration)
    expect(integration.channel).toBe(Integration.CHANNEL_EMAIL)
    expect(integration.provider).toBeInstanceOf(MockProvider)
  })

  it("should throw an exception when provider capabilities do not support channel", () => {
    const mockProvider = new MockProvider()

    try {
      new Integration(Integration.CHANNEL_SMS, mockProvider)
    }
    catch (err) {
      expect(err).toBeInstanceOf(Error)
    }
  })
})
