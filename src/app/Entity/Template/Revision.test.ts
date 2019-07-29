
import Revision from './Revision'
import Channels from './Revision/Channels'
import Defaults from './Revision/Defaults'
import Email from './Revision/Email'
import EmailBody from './Revision/Email/Body'
import Sms from './Revision/Sms'
import Push from './Revision/Push'
import Callback from './Revision/Callback'
import Test from './Revision/Test'

const getMockRevision = (version: number, parent: number | null = null, isHtml: boolean = true): Revision => {
  const revision: Revision = new Revision(version, parent)

  revision.channels = new Channels()
  revision.channels.preferred = [Channels.TYPE_PUSH, Channels.TYPE_SMS]
  revision.channels.required = [Channels.TYPE_EMAIL]

  revision.defaults = new Defaults()
  revision.defaults.title = 'Default title'
  revision.defaults.body = 'Default body'

  revision.email = new Email()
  revision.email.title = 'Email title'
  revision.email.senderName = 'Sender Name'
  revision.email.senderEmail = 'Sender Email'
  revision.email.isHtml = isHtml
  revision.email.body = new EmailBody()
  revision.email.body.text = 'Email plain text'
  revision.email.body.html = '<html></html>'

  revision.sms = new Sms()
  revision.sms.from = 'Sms from'
  revision.sms.body = 'Sms body'

  revision.push = new Push()
  revision.push.title = 'Push title'
  revision.push.from = 'Push from'
  revision.push.body = 'Push body'

  revision.callback = new Callback()
  revision.callback.title = 'Callback title'
  revision.callback.from = 'Callback from'
  revision.callback.body = 'Callback body'

  revision.test = new Test()
  revision.test.vars = {
    foo: 'bar'
  }

  return revision
}

describe("Entity/Template/Revision", () => {
  it("should instantiate with constructor parameters", () => {
    const revision: Revision = new Revision(2, 1)

    expect(revision.number).toBe(2)
    expect(revision.parent).toBe(1)
    expect(revision.channels).toBeInstanceOf(Channels)
    expect(revision.defaults).toBeInstanceOf(Defaults)
    expect(revision.email).toBeInstanceOf(Email)
    expect(revision.sms).toBeInstanceOf(Sms)
    expect(revision.push).toBeInstanceOf(Push)
    expect(revision.callback).toBeInstanceOf(Callback)
    expect(revision.test).toBeInstanceOf(Test)
  })

  it("should get title", () => {
    const revision = getMockRevision(1)

    expect(revision.getTitle(Channels.TYPE_EMAIL)).toBe('Email title')
    expect(revision.getTitle(Channels.TYPE_SMS)).toBe('Default title')
    expect(revision.getTitle(Channels.TYPE_PUSH)).toBe('Push title')
    expect(revision.getTitle(Channels.TYPE_CALLBACK)).toBe('Callback title')
  })

  it("should get body", () => {
    let revision: Revision

    // With email html body
    revision = getMockRevision(1, null, true)

    expect(revision.getBody(Channels.TYPE_EMAIL)).toBe('<html></html>')
    expect(revision.getBody(Channels.TYPE_SMS)).toBe('Sms body')
    expect(revision.getBody(Channels.TYPE_PUSH)).toBe('Push body')
    expect(revision.getBody(Channels.TYPE_CALLBACK)).toBe('Callback body')

    // With email plain text body
    revision = getMockRevision(1, null, false)

    expect(revision.getBody(Channels.TYPE_EMAIL)).toBe('Email plain text')

    // Width default body
    revision = new Revision(1)

    revision.defaults = new Defaults()
    revision.defaults.title = 'Default title'
    revision.defaults.body = 'Default body'

    expect(revision.getBody(Channels.TYPE_EMAIL)).toBe('Default body')
    expect(revision.getBody(Channels.TYPE_SMS)).toBe('Default body')
    expect(revision.getBody(Channels.TYPE_PUSH)).toBe('Default body')
    expect(revision.getBody(Channels.TYPE_CALLBACK)).toBe('Default body')
  })

  it("should serialize", () => {
    const revision = getMockRevision(1)

    const data: object = revision.serialize()

    expect(data).toBeInstanceOf(Object)

    const map: Map<string, any> = new Map(Object.entries(data))

    expect(map.get('number')).toEqual(1)
    expect(map.get('parent')).toBeNull()
    expect(map.get('channels')).toBeInstanceOf(Object)
    expect(map.get('defaults')).toBeInstanceOf(Object)
    expect(map.get('email')).toBeInstanceOf(Object)
    expect(map.get('sms')).toBeInstanceOf(Object)
    expect(map.get('push')).toBeInstanceOf(Object)
    expect(map.get('callback')).toBeInstanceOf(Object)
    expect(map.get('test')).toBeInstanceOf(Object)

    const mapChannels: Map<string, any> = new Map(Object.entries(map.get('channels')))

    expect(mapChannels.get('preferred')).toBeInstanceOf(Array)
    expect(mapChannels.get('preferred').length).toBe(2)
    expect(mapChannels.get('preferred')[0]).toBe(Channels.TYPE_PUSH)
    expect(mapChannels.get('preferred')[1]).toBe(Channels.TYPE_SMS)

    expect(mapChannels.get('required')).toBeInstanceOf(Array)
    expect(mapChannels.get('required').length).toBe(1)
    expect(mapChannels.get('required')[0]).toBe(Channels.TYPE_EMAIL)

    const mapEmail: Map<string, any> = new Map(Object.entries(map.get('email')))

    expect(mapEmail.get('title')).toBe('Email title')
    expect(mapEmail.get('senderName')).toBe('Sender Name')
    expect(mapEmail.get('senderEmail')).toBe('Sender Email')
    expect(mapEmail.get('isHtml')).toBeTruthy()
    expect(mapEmail.get('body')).toBeInstanceOf(Object)

    const mapEmailBody: Map<string, any> = new Map(Object.entries(mapEmail.get('body')))

    expect(mapEmailBody.get('text')).toBe('Email plain text')
    expect(mapEmailBody.get('html')).toBe('<html></html>')

    const mapSms: Map<string, any> = new Map(Object.entries(map.get('sms')))

    expect(mapSms.get('from')).toBe('Sms from')
    expect(mapSms.get('body')).toBe('Sms body')

    const mapPush: Map<string, any> = new Map(Object.entries(map.get('push')))

    expect(mapPush.get('title')).toBe('Push title')
    expect(mapPush.get('from')).toBe('Push from')
    expect(mapPush.get('body')).toBe('Push body')

    const mapCallback: Map<string, any> = new Map(Object.entries(map.get('callback')))

    expect(mapCallback.get('title')).toBe('Callback title')
    expect(mapCallback.get('from')).toBe('Callback from')
    expect(mapCallback.get('body')).toBe('Callback body')

    const mapTest: Map<string, any> = new Map(Object.entries(map.get('test')))

    expect(mapTest.get('vars')).toBeInstanceOf(Object)
    expect(mapTest.get('vars').foo).toBe('bar')
  })

  it("should unserialize", () => {
    const revision: Revision = new Revision(1)

    revision.unserialize(null)

    expect(revision.number).toBe(1)
    expect(revision.parent).toBeNull()
    expect(revision.channels).toBeInstanceOf(Channels)
    expect(revision.defaults).toBeInstanceOf(Defaults)
    expect(revision.email).toBeInstanceOf(Email)
    expect(revision.email.body).toBeInstanceOf(EmailBody)
    expect(revision.sms).toBeInstanceOf(Sms)
    expect(revision.push).toBeInstanceOf(Push)
    expect(revision.callback).toBeInstanceOf(Callback)
    expect(revision.test).toBeInstanceOf(Test)


    const data: Object = {
      number: 1,
      parent: null,
      channels: {
        preferred: [ 'push', 'sms' ],
        required: [ 'email' ]
      },
      defaults: {
        title: 'Default title',
        body: 'Default body'
      },
      email: {
        title: 'Email title',
        senderName: 'Sender Name',
        senderEmail: 'Sender Email',
        body: {
          text: 'Email plain text',
          html: '<html></html>'
        },
        isHtml: true
      },
      sms: {
        from: 'Sms from',
        body: 'Sms body'
      },
      push: {
        title: 'Push title',
        from: 'Push from',
        body: 'Push body'
      },
      callback: {
        title: 'Callback title',
        from: 'Callback from',
        body: 'Callback body'
      },
      test: {
        vars: {
          foo: 'bar'
        }
      }
    }

    revision.unserialize(data)

    const map: Map<string, any> = new Map(Object.entries(data))

    expect(map.get('number')).toEqual(1)
    expect(map.get('parent')).toBeNull()
    expect(map.get('channels')).toBeInstanceOf(Object)
    expect(map.get('defaults')).toBeInstanceOf(Object)
    expect(map.get('email')).toBeInstanceOf(Object)
    expect(map.get('sms')).toBeInstanceOf(Object)
    expect(map.get('push')).toBeInstanceOf(Object)
    expect(map.get('callback')).toBeInstanceOf(Object)
    expect(map.get('test')).toBeInstanceOf(Object)

    const mapChannels: Map<string, any> = new Map(Object.entries(map.get('channels')))

    expect(mapChannels.get('preferred')).toBeInstanceOf(Array)
    expect(mapChannels.get('preferred').length).toBe(2)
    expect(mapChannels.get('preferred')[0]).toBe(Channels.TYPE_PUSH)
    expect(mapChannels.get('preferred')[1]).toBe(Channels.TYPE_SMS)

    expect(mapChannels.get('required')).toBeInstanceOf(Array)
    expect(mapChannels.get('required').length).toBe(1)
    expect(mapChannels.get('required')[0]).toBe(Channels.TYPE_EMAIL)

    const mapEmail: Map<string, any> = new Map(Object.entries(map.get('email')))

    expect(mapEmail.get('title')).toBe('Email title')
    expect(mapEmail.get('senderName')).toBe('Sender Name')
    expect(mapEmail.get('senderEmail')).toBe('Sender Email')
    expect(mapEmail.get('isHtml')).toBeTruthy()
    expect(mapEmail.get('body')).toBeInstanceOf(Object)

    const mapEmailBody: Map<string, any> = new Map(Object.entries(mapEmail.get('body')))

    expect(mapEmailBody.get('text')).toBe('Email plain text')
    expect(mapEmailBody.get('html')).toBe('<html></html>')

    const mapSms: Map<string, any> = new Map(Object.entries(map.get('sms')))

    expect(mapSms.get('from')).toBe('Sms from')
    expect(mapSms.get('body')).toBe('Sms body')

    const mapPush: Map<string, any> = new Map(Object.entries(map.get('push')))

    expect(mapPush.get('title')).toBe('Push title')
    expect(mapPush.get('from')).toBe('Push from')
    expect(mapPush.get('body')).toBe('Push body')

    const mapCallback: Map<string, any> = new Map(Object.entries(map.get('callback')))

    expect(mapCallback.get('title')).toBe('Callback title')
    expect(mapCallback.get('from')).toBe('Callback from')
    expect(mapCallback.get('body')).toBe('Callback body')

    const mapTest: Map<string, any> = new Map(Object.entries(map.get('test')))

    expect(mapTest.get('vars')).toBeInstanceOf(Object)
    expect(mapTest.get('vars').foo).toBe('bar')
  })
})
