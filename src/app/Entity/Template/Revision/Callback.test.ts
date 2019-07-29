
import Callback from './Callback'

describe('Entity/Template/Revision/Callback', () => {
  it("should instantiate without constructor parameters", () => {
    const callback: Callback = new Callback()

    expect(callback.title).toBeNull()
    expect(callback.from).toBeNull()
    expect(callback.body).toBeNull()
  })

  it("should instantiate with constructor parameters", () => {
    const callback: Callback = new Callback('callback title', 'callback from', 'callback body')

    expect(callback.title).toEqual('callback title')
    expect(callback.from).toEqual('callback from')
    expect(callback.body).toEqual('callback body')
  })

  it("should serialize", () => {
    const callback: Callback = new Callback('callback title', 'callback from', 'callback body')

    const data: object = callback.serialize()

    expect(data).toBeInstanceOf(Object)

    const map: Map<string, string> = new Map(Object.entries(data))

    expect(map.get('title')).toEqual('callback title')
    expect(map.get('from')).toEqual('callback from')
    expect(map.get('body')).toEqual('callback body')
  })

  it("should unserialize", () => {
    const callback: Callback = new Callback()

    callback.unserialize(null)

    expect(callback.title).toBeNull()
    expect(callback.from).toBeNull()
    expect(callback.body).toBeNull()

    const data: object = {
      title: 'callback title',
      from: 'callback from',
      body: 'callback body',
    }

    callback.unserialize(data)

    expect(callback.title).toEqual('callback title')
    expect(callback.from).toEqual('callback from')
    expect(callback.body).toEqual('callback body')
  })
})
