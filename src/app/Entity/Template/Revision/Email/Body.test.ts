
import Body from './Body'

describe('Entity/Template/Revision/Emaill/Body', () => {
  it("should instantiate without constructor parameters", () => {
    const body: Body = new Body()

    expect(body.text).toBeNull()
    expect(body.html).toBeNull()
  })

  it("should instantiate with constructor parameters", () => {
    const body: Body = new Body('default text', '<html></html>')

    expect(body.text).toEqual('default text')
    expect(body.html).toEqual('<html></html>')
  })

  /*it("should serialize", () => {
    const body: Body = new Body('default text', '<html></html>')

    const data: object = body.serialize()

    expect(data).toBeInstanceOf(Object)

    const map: Map<string, string> = new Map(Object.entries(data))

    // expect(map.get('text')).toEqual('default text')
    // expect(map.get('html')).toEqual('<html></html>')
  })*/

  it("should unserialize", () => {
    const data: object = {
      text: 'default text',
      html: '<html></html>',
    }

    const body: Body = new Body()
    body.unserialize(data)


    expect(body.text).toEqual('default text')
    expect(body.html).toEqual('<html></html>')
  })
})
