
import Defaults from './Defaults'

describe("Entity/Template/Revision/Defaults", () => {
  it("should instantiate without constructor parameters", () => {
    const defaults: Defaults = new Defaults()

    expect(defaults.title).toEqual('')
    expect(defaults.body).toEqual('')
  })

  it("should instantiate with constructor parameters", () => {
    const defaults: Defaults = new Defaults('default title', 'default body')

    expect(defaults.title).toEqual('default title')
    expect(defaults.body).toEqual('default body')
  })

  it("should serialize", () => {
    const defaults: Defaults = new Defaults('default title', 'default body')

    const data: object = defaults.serialize()

    expect(data).toBeInstanceOf(Object)

    const map: Map<string, any> = new Map(Object.entries(data))

    expect(map.get('title')).toEqual('default title')
    expect(map.get('body')).toEqual('default body')
  })

  it("should unserialize", () => {
    const data: object = {
      title: 'default title',
      body: 'default body',
    }

    const defaults: Defaults = new Defaults()
    defaults.unserialize(data)

    expect(defaults.title).toEqual('default title')
    expect(defaults.body).toEqual('default body')
  })
})
