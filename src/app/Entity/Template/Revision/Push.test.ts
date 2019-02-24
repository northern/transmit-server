
import Push from './Push'

describe("Entity/Template/Revision/Push", () => {
  it("should instantiate without constructor parameters", () => {
    const push: Push = new Push()

    expect(push.title).toBeNull()
    expect(push.from).toBeNull()
    expect(push.body).toBeNull()
  })

  it("should instantiate with constructor parameters", () => {
    const push: Push = new Push(
      'default title',
      'default from',
      'default body'
    )

    expect(push.title).toEqual('default title')
    expect(push.from).toEqual('default from')
    expect(push.body).toEqual('default body')
  })

  it("should serialize", () => {
    const push: Push = new Push(
      'default title',
      'default from',
      'default body'
    )

    const data: object = push.serialize()

    expect(data).toBeInstanceOf(Object)

    const map: Map<string, any> = new Map(Object.entries(data))

    expect(map.get('title')).toEqual('default title')
    expect(map.get('from')).toEqual('default from')
    expect(map.get('body')).toEqual('default body')
  })

  it("should unserialize", () => {
    const push: Push = new Push()

    push.unserialize(null)

    expect(push.title).toBeNull()
    expect(push.from).toBeNull()
    expect(push.body).toBeNull()

    const data: object = {
      title: 'default title',
      from: 'default from',
      body: 'default body',
    }

    push.unserialize(data)

    expect(push.title).toEqual('default title')
    expect(push.from).toEqual('default from')
    expect(push.body).toEqual('default body')
  })
})
