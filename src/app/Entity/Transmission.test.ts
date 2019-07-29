
import Transmission from './Transmission'

describe("Entity/Transmission", () => {
  it("should instantiate with the default constructor", () => {
    const transmission: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL)

    expect(transmission).toBeInstanceOf(Transmission)
  })

  it('should get statuses', () => {
    const statuses = Transmission.getStatuses()

    expect(statuses).toBeInstanceOf(Array)
    expect(statuses.length).toBe(5)
    expect(statuses).toContain(Transmission.STATUS_PENDING)
    expect(statuses).toContain(Transmission.STATUS_PROCESSING)
    expect(statuses).toContain(Transmission.STATUS_FAILED)
    expect(statuses).toContain(Transmission.STATUS_RETRY)
    expect(statuses).toContain(Transmission.STATUS_OK)
  })

  it('should get channels', () => {
    const channels = Transmission.getChannels()

    expect(channels).toBeInstanceOf(Array)
    expect(channels.length).toBe(5)
    expect(channels).toContain(Transmission.CHANNEL_EMAIL)
    expect(channels).toContain(Transmission.CHANNEL_SMS)
    expect(channels).toContain(Transmission.CHANNEL_PUSH)
    expect(channels).toContain(Transmission.CHANNEL_CALLBACK)
    expect(channels).toContain(Transmission.CHANNEL_CHAT)
  })  
})
