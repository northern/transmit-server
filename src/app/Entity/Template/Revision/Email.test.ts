
import Email from './Email'
import Body from './Email/Body'

describe("Entity/Template/Revision/Email", () => {
  it("should instantiate without constructor parameters", () => {
    const email: Email = new Email()

    expect(email.title).toBeNull()
    expect(email.senderName).toBeNull()
    expect(email.senderEmail).toBeNull()
    expect(email.body).toBeInstanceOf(Body)
    expect(email.isHtml).toBeFalsy()
  })

  it("should instantiate with constructor parameters", () => {
    const email: Email = new Email(
      'default title',
      'default sender name',
      'default sender email',
      new Body('default text', '<html></html>'),
      false
    )

    expect(email.title).toEqual('default title')
    expect(email.senderName).toEqual('default sender name')
    expect(email.senderEmail).toEqual('default sender email')
    expect(email.body.text).toEqual('default text')
    expect(email.body.html).toEqual('<html></html>')
    expect(email.isHtml).toBeFalsy();
  })

  it("should serialize", () => {
    const email: Email = new Email(
      'default title',
      'default sender name',
      'default sender email',
      new Body('default text', '<html></html>'),
      false
    )

    const data: object = email.serialize()

    expect(data).toBeInstanceOf(Object)

    const emailMap: Map<string, any> = new Map(Object.entries(data))

    expect(emailMap.get('title')).toEqual('default title')
    expect(emailMap.get('senderName')).toEqual('default sender name')
    expect(emailMap.get('senderEmail')).toEqual('default sender email')
    expect(emailMap.get('body')).toBeInstanceOf(Object)

    const bodyMap: Map<string, any> = new Map(Object.entries(emailMap.get('body')))

    expect(bodyMap.get('text')).toEqual('default text')
    expect(bodyMap.get('html')).toEqual('<html></html>')
  })

  it("should unserialize", () => {
    const data: object = {
      title: 'default title',
      senderEmail: 'default sender email',
      senderName: 'default sender name',
      body: {
        text: 'default text',
        html: '<html></html>',
      },
      isHtml: false,
    }

    const email: Email = new Email()
    email.unserialize(data)

    expect(email.title).toEqual('default title')
    expect(email.senderEmail).toEqual('default sender email')
    expect(email.senderName).toEqual('default sender name')
    expect(email.body.text).toEqual('default text')
    expect(email.body.html).toEqual('<html></html>')
    expect(email.isHtml).toBeFalsy()
  })
})
