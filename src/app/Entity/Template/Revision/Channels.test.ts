
import Channels from './Channels'

describe('Entity/Template/Revision/Channel', () => {
  it("should instantiate without constructor parameters", () => {
    const channels: Channels = new Channels()

    expect(channels.preferred).toEqual([])
    expect(channels.required).toEqual([])
  })

  it("should instantiate with constructor parameters", () => {
    const channels: Channels = new Channels(
      [Channels.TYPE_EMAIL], [Channels.TYPE_SMS]
    )

    expect(channels.preferred).toEqual([Channels.TYPE_EMAIL])
    expect(channels.required).toEqual([Channels.TYPE_SMS])
  })

  it("should serialize", () => {
    const channels: Channels = new Channels(
      [Channels.TYPE_EMAIL], [Channels.TYPE_SMS]
    )

    const data: object = channels.serialize()

    expect(data).toBeInstanceOf(Object)

    const map: Map<string, string> = new Map(Object.entries(data))

    expect(map.get('preferred')).toEqual([Channels.TYPE_EMAIL])
    expect(map.get('required')).toEqual([Channels.TYPE_SMS])
  })

  it("should unserialize", () => {
    const data: object = {
      preferred: [Channels.TYPE_EMAIL],
      required: [Channels.TYPE_SMS],
    }

    const channels: Channels = new Channels()
    channels.unserialize(data)

    expect(channels.preferred).toEqual([Channels.TYPE_EMAIL])
    expect(channels.required).toEqual([Channels.TYPE_SMS])
  })
})
