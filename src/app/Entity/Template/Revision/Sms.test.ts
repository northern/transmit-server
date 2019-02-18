
import Sms from './Sms'

describe("Entity/Template/Revision/Sms", () => {
  it("should instantiate without constructor parameters", () => {
    const push: Sms = new Sms()

    expect(push.from).toBeNull()
    expect(push.body).toBeNull()
  })

  it("should instantiate with constructor parameters", () => {
    const sms: Sms = new Sms(
      'default from',
      'default body'
    )

    expect(sms.from).toEqual('default from')
    expect(sms.body).toEqual('default body')
  })

  it("should serialize", () => {
    const sms: Sms = new Sms(
      'default from',
      'default body'
    )

    const data: object = sms.serialize()

    expect(data).toBeInstanceOf(Object)

    const map: Map<string, any> = new Map(Object.entries(data))

    expect(map.get('from')).toEqual('default from')
    expect(map.get('body')).toEqual('default body')
  })

  it("should unserialize", () => {
    const data: object = {
      from: 'default from',
      body: 'default body',
    }

    const sms: Sms = new Sms()
    sms.unserialize(data)

    expect(sms.from).toEqual('default from')
    expect(sms.body).toEqual('default body')
  })
})
