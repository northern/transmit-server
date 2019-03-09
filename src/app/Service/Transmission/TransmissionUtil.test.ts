
import Message from '../../Entity/Message'
import Template from '../../Entity/Template'
import Transmission from '../../Entity/Transmission'
import TransmissionTarget from '../../Entity/TransmissionTarget'
import TransmissionUtil from './TransmissionUtil'

describe('getCombinedVars', () => {
  let transmissionUtil: TransmissionUtil

  beforeEach(() => {
    transmissionUtil = new TransmissionUtil()
  })

  it("should return the combination of two simple objects", () => {
    const objectA = {
      foo: 123
    }
    const objectB = {
      bar: "abc"
    }
    const expectedResult = {
      foo: 123,
      bar: "abc"
    }

    const combined = transmissionUtil.getCombinedVars(objectA, objectB)
    expect(combined).toEqual(expectedResult)
  })

  it("should return the combination of two complex (nested) objects", () => {
    const objectA = {
      foo: 123,
      baz: {
        foo: "abc"
      }
    }
    const objectB = {
      bar: "abc",
      qux: {
        bar: 123
      }
    }
    const expectedResult = {
      foo: 123,
      baz: {
        foo: "abc"
      },
      bar: "abc",
      qux: {
        bar: 123
      }
    }

    const combined = transmissionUtil.getCombinedVars(objectA, objectB)
    expect(combined).toEqual(expectedResult)
  })

  it("should return empty object when given objects are empty", () => {
    const combined = transmissionUtil.getCombinedVars({}, {})
    expect(combined).toEqual({})
  })
})

describe('recipientToTransmissionTarget', () => {
  const transmissionUtil = new TransmissionUtil()

  it("should return the email when set", () => {
    const email = "info@postways.com"

    const target = transmissionUtil.recipientToTransmissionTarget({email})
    expect(target.email).toEqual(email)
  })

  it("should return the phone number when set", () => {
    const phone = "0123456789"

    const target = transmissionUtil.recipientToTransmissionTarget({phone})
    expect(target.phone).toEqual(phone)
  })

  it("should return the push token when set", () => {
    const push = {token:"abc123"}

    const target = transmissionUtil.recipientToTransmissionTarget({push})
    expect(target.push).toEqual(push)
  })

  it("should return the callback when set", () => {
    const callback = "http://www.example.com"

    const target = transmissionUtil.recipientToTransmissionTarget({callback})
    expect(target.callback).toEqual(callback)
  })

  it("should return the chat when set", () => {
    const chat = {
      username: "bob",
      password: "s3cr3t"
    }

    const target = transmissionUtil.recipientToTransmissionTarget({chat})
    expect(target.chat).toEqual(chat)
  })

  it("should return the vars when set", () => {
    const vars = {
      foo: 123,
      bar: {
        baz: "abc"
      }
    }

    const target = transmissionUtil.recipientToTransmissionTarget({vars})
    expect(target.vars).toEqual(vars)
  })
})

describe('getPrioritizedChannels', () => {
  let transmissionUtil: TransmissionUtil
  let templateChannels: Array<string>

  beforeEach(() => {
    transmissionUtil = new TransmissionUtil()

    templateChannels = [
      Template.CHANNEL_TYPE_EMAIL,
      Template.CHANNEL_TYPE_PUSH,
      Template.CHANNEL_TYPE_SMS
    ]
  })

  it("should return the same channels when no priority channels are provided", () => {
    let channels: Array<string>

    channels = transmissionUtil.getPrioritizedChannels(templateChannels)
    expect(channels).toEqual(templateChannels)

    channels = transmissionUtil.getPrioritizedChannels(templateChannels, [])
    expect(channels).toEqual(templateChannels)
  })

  it("should return the 'email' priority channel when provided", () => {
    let channels: Array<string>

    channels = transmissionUtil.getPrioritizedChannels(templateChannels, [
      Template.CHANNEL_TYPE_EMAIL
    ])
    expect(channels).toEqual([Template.CHANNEL_TYPE_EMAIL])
  })

  it("should return both 'sms' and 'push' priority channels when provided", () => {
    let channels: Array<string>

    channels = transmissionUtil.getPrioritizedChannels(templateChannels, [
      Template.CHANNEL_TYPE_SMS,
      Template.CHANNEL_TYPE_PUSH
    ])
    expect(channels).toEqual([Template.CHANNEL_TYPE_SMS, Template.CHANNEL_TYPE_PUSH])
  })

  it("should return no channels if the priority channel does not exist on the template", () => {
    let channels: Array<string>

    channels = transmissionUtil.getPrioritizedChannels([
        Template.CHANNEL_TYPE_SMS,
        Template.CHANNEL_TYPE_PUSH
      ], [
        Template.CHANNEL_TYPE_EMAIL
      ]
    )
    expect(channels).toEqual([])
  })
})

describe('createTransmissions (preferred channels)', () => {
  let transmissionUtil: TransmissionUtil
  let capabilities: Array<string>
  let message: Message

  beforeEach(() => {
    transmissionUtil = new TransmissionUtil()

    capabilities = [
      Template.CHANNEL_TYPE_EMAIL,
      Template.CHANNEL_TYPE_SMS,
      Template.CHANNEL_TYPE_PUSH,
      Template.CHANNEL_TYPE_CHAT,
      Template.CHANNEL_TYPE_CALLBACK
    ]

    message = new Message()
    message.id = 1
  })

  it("should return an email transmission", () => {
    const target = new TransmissionTarget()
    target.email = "info@postways.com"
    target.phone = "0123456789"
    target.push  = {token: "abc123"}
    target.callback = "http://www.example.com"
    target.chat = {username: "bob", password: "s3cr3t"}

    const transmissions = transmissionUtil.createTransmissions(message, target, ['email', 'sms', 'push', 'callback', 'chat'], TransmissionUtil.CHANNEL_PREFERRED, capabilities)
    expect(transmissions.length).toBe(1)
    expect(transmissions[0].channel).toEqual('email')
    expect(transmissions[0].target).toEqual("info@postways.com")
  })

  it("should return an sms transmission", () => {
    const target = new TransmissionTarget()
    target.phone = "0123456789"
    target.push  = {token: "abc123"}
    target.callback = "http://www.example.com"
    target.chat = {username: "bob", password: "s3cr3t"}

    const transmissions = transmissionUtil.createTransmissions(message, target, ['email', 'sms', 'push', 'callback', 'chat'], TransmissionUtil.CHANNEL_PREFERRED, capabilities)
    expect(transmissions.length).toBe(1)
    expect(transmissions[0].channel).toEqual('sms')
    expect(transmissions[0].target).toEqual("0123456789")
  })

  it("should return a push transmission", () => {
    const target = new TransmissionTarget()
    target.push  = {token: "abc123"}
    target.callback = "http://www.example.com"
    target.chat = {username: "bob", password: "s3cr3t"}

    const transmissions = transmissionUtil.createTransmissions(message, target, ['email', 'sms', 'push', 'callback', 'chat'], TransmissionUtil.CHANNEL_PREFERRED, capabilities)
    expect(transmissions.length).toBe(1)
    expect(transmissions[0].channel).toEqual('push')
    expect(transmissions[0].target).toEqual({token: "abc123"})
  })

  it("should return a callback transmission", () => {
    const target = new TransmissionTarget()
    target.callback = "http://www.example.com"
    target.chat = {username: "bob", password: "s3cr3t"}

    const transmissions = transmissionUtil.createTransmissions(message, target, ['email', 'sms', 'push', 'callback', 'chat'], TransmissionUtil.CHANNEL_PREFERRED, capabilities)
    expect(transmissions.length).toBe(1)
    expect(transmissions[0].channel).toEqual('callback')
    expect(transmissions[0].target).toEqual("http://www.example.com")
  })

  it("should return a callback transmission", () => {
    const target = new TransmissionTarget()
    target.chat = {username: "bob", password: "s3cr3t"}

    const transmissions = transmissionUtil.createTransmissions(message, target, ['email', 'sms', 'push', 'callback', 'chat'], TransmissionUtil.CHANNEL_PREFERRED, capabilities)
    expect(transmissions.length).toBe(1)
    expect(transmissions[0].channel).toEqual('chat')
    expect(transmissions[0].target).toEqual({username: "bob", password: "s3cr3t"})
  })

  it("should return no transmission", () => {
    const target = new TransmissionTarget()

    const transmissions = transmissionUtil.createTransmissions(message, target, ['email', 'sms', 'push', 'callback', 'chat'], TransmissionUtil.CHANNEL_PREFERRED, capabilities)
    expect(transmissions.length).toBe(0)
  })
})

describe('createTransmissions (required channels)', () => {
  let transmissionUtil: TransmissionUtil
  let capabilities: Array<string>
  let message: Message

  beforeEach(() => {
    transmissionUtil = new TransmissionUtil()

    capabilities = [
      Template.CHANNEL_TYPE_EMAIL,
      Template.CHANNEL_TYPE_SMS,
      Template.CHANNEL_TYPE_PUSH,
      Template.CHANNEL_TYPE_CHAT,
      Template.CHANNEL_TYPE_CALLBACK
    ]

    message = new Message()
    message.id = 1
  })

  it("should return five transmissions", () => {
    const target = new TransmissionTarget()
    target.email = "info@postways.com"
    target.phone = "0123456789"
    target.push  = {token: "abc123"}
    target.callback = "http://www.example.com"
    target.chat = {username: "bob", password: "s3cr3t"}

    const transmissions: Array<Transmission> = transmissionUtil.createTransmissions(message, target, ['email', 'sms', 'push', 'callback', 'chat'], TransmissionUtil.CHANNEL_REQUIRED, capabilities)
    expect(transmissions.length).toBe(5)

    let transmission: Transmission | undefined

    transmission = transmissions.find(transmission => transmission.channel === 'email')
    expect(transmission).not.toBeNull()

    if (transmission) {
      expect(transmission.channel).toEqual('email')
      expect(transmission.target).toEqual("info@postways.com")
    }

    transmission = transmissions.find(transmission => transmission.channel === 'sms')
    expect(transmission).not.toBeNull()

    if (transmission) {
      expect(transmission.channel).toEqual('sms')
      expect(transmission.target).toEqual("0123456789")
    }

    transmission = transmissions.find(transmission => transmission.channel === 'push')
    expect(transmission).not.toBeNull()

    if (transmission) {
      expect(transmission.channel).toEqual('push')
      expect(transmission.target).toEqual({token: "abc123"})
    }

    transmission = transmissions.find(transmission => transmission.channel === 'callback')
    expect(transmission).not.toBeNull()

    if (transmission) {
      expect(transmission.channel).toEqual('callback')
      expect(transmission.target).toEqual("http://www.example.com")
    }

    transmission = transmissions.find(transmission => transmission.channel === 'chat')
    expect(transmission).not.toBeNull()

    if (transmission) {
      expect(transmission.channel).toEqual('chat')
      expect(transmission.target).toEqual({username: "bob", password: "s3cr3t"})
    }
  })

  it("should return no transmissions", () => {
    const target = new TransmissionTarget()

    const transmissions = transmissionUtil.createTransmissions(message, target, ['email', 'sms', 'push', 'callback', 'chat'], TransmissionUtil.CHANNEL_REQUIRED, capabilities)
    expect(transmissions.length).toBe(0)
  })
})
