
import Message from '../../Entity/Message'
import Template from '../../Entity/Template'
import TemplateRevision from '../../Entity/Template/Revision'
import Transmission from '../../Entity/Transmission'
import TransmissionTarget from '../../Entity/TransmissionTarget'
import Integration from '../../Entity/Integration'
import IProvider from '../../Entity/Integration/IProvider'
import TransmissionService from './TransmissionService'
import TransmissionUtil from './TransmissionUtil'
import TransmissionValidator from './TransmissionValidator'
import TransmissionRepository from './TransmissionRepository'
import IStorage from './Storage/IStorage'

const getMockIntegrations = (): Array<Integration> => {
  const MockProvider = jest.fn<IProvider>(() => ({
    getCapabilities: jest.fn(() => {
      return ['email', 'sms', 'push', 'chat', 'callback']
    })
  }))

  const MockIntegration = jest.fn<Integration>(() => ({
    provider: new MockProvider()
  }))

  const mockIntegration: Integration = new MockIntegration()

  const mockIntegrations: Array<Integration> = []
  mockIntegrations.push(mockIntegration)

  return mockIntegrations
}

describe('create (required channels)', () => {
  let idIndex: number
  let transmissionService: TransmissionService

  beforeEach(() => {
    idIndex = 0

    const MockRepository = jest.fn<TransmissionRepository>(() => ({
      persist: jest.fn((transmission: Transmission, _connection: any) => {
        idIndex++

        transmission.id = idIndex

        return transmission
      }),
    }))

    transmissionService = new TransmissionService()
    transmissionService.setUtil(new TransmissionUtil())
    transmissionService.setRepository(new MockRepository())
    transmissionService.setValidator(new TransmissionValidator())
  })

  it("should return one transmission", async () => {
    const message: Message = new Message()
    message.id = 1
    message.data = {
      template: {
        channels: {
          required: ['email'],
        },
      },
      recipients: [{
        email: "info@postways.com",
      }]
    }

    const revision: TemplateRevision = new TemplateRevision(1)
    revision.unserialize(message.data.template)

    const mockIntegrations: Integration[] = getMockIntegrations();

    const transmissions = await transmissionService.create(message, revision, [], mockIntegrations, null)

    expect(transmissions.length).toBe(1)
    expect(transmissions[0].id).toEqual(1)
    expect(transmissions[0].channel).toEqual('email')
    expect(transmissions[0].target).toEqual("info@postways.com")
  })

  it("should return two transmissions", async () => {
    const message = new Message()
    message.id = 1
    message.data = {
      template: {
        channels: {
          required: ['email', 'sms'],
        },
      },
      recipients: [{
        email: "info@postways.com",
        phone: "0123456789"
      }]
    }

    const revision = new TemplateRevision(1)
    revision.unserialize(message.data.template)

    const mockIntegrations: Integration[] = getMockIntegrations();

    const transmissions: Transmission[] = await transmissionService.create(message, revision, [], mockIntegrations, null)

    let transmission: Transmission

    transmission = transmissions.find((transmission: Transmission): boolean => transmission.channel === 'email')
    expect(transmission).toBeInstanceOf(Transmission)
    expect(transmission.channel).toEqual('email')
    expect(transmission.target).toEqual("info@postways.com")

    transmission = transmissions.find((transmission: Transmission): boolean => transmission.channel === 'sms')
    expect(transmission).toBeInstanceOf(Transmission)
    expect(transmission.channel).toEqual('sms')
    expect(transmission.target).toEqual("0123456789")
  })  

  it("should return three transmissions", async () => {
    const message: Message = new Message()
    message.id = 1
    message.data = {
      template: {
        channels: {
          required: ['email', 'sms', 'push'],
        },
      },
      recipients: [{
        email: "info@postways.com",
        phone: "0123456789",
        push: {
          token: "abc123"
        }
      }]
    }

    const revision: TemplateRevision = new TemplateRevision(1)
    revision.unserialize(message.data.template)

    const mockIntegrations: Integration[] = getMockIntegrations();

    const transmissions: Transmission[] = await transmissionService.create(message, revision, [], mockIntegrations, null)

    expect(transmissions.length).toBe(3)

    let transmission: Transmission

    transmission = transmissions.find(transmission => transmission.channel === 'email')
    expect(transmission).toBeInstanceOf(Transmission)
    expect(transmission.channel).toEqual('email')
    expect(transmission.target).toEqual("info@postways.com")

    transmission = transmissions.find(transmission => transmission.channel === 'sms')
    expect(transmission).toBeInstanceOf(Transmission)
    expect(transmission.channel).toEqual('sms')
    expect(transmission.target).toEqual("0123456789")

    transmission = transmissions.find(transmission => transmission.channel === 'push')
    expect(transmission).toBeInstanceOf(Transmission)
    expect(transmission.channel).toEqual('push')
    expect(transmission.target).toEqual({token: "abc123"})
  })  

  it("should return four transmissions", async () => {
    const message: Message = new Message()
    message.id = 1
    message.data = {
      template: {
        channels: {
          required: ['email', 'sms', 'push', 'callback'],
        },
      },
      recipients: [{
        email: "info@postways.com",
        phone: "0123456789",
        push: {
          token: "abc123"
        },
        callback: "http://www.example.com"
      }]
    }

    const revision: TemplateRevision = new TemplateRevision(1)
    revision.unserialize(message.data.template)

    const mockIntegrations: Integration[] = getMockIntegrations();

    const transmissions: Transmission[] = await transmissionService.create(message, revision, [], mockIntegrations, null)

    expect(transmissions.length).toBe(4)

    let transmission: Transmission

    transmission = transmissions.find(transmission => transmission.channel === 'email')
    expect(transmission).toBeInstanceOf(Transmission)
    expect(transmission.channel).toEqual('email')
    expect(transmission.target).toEqual("info@postways.com")

    transmission = transmissions.find(transmission => transmission.channel === 'sms')
    expect(transmission).toBeInstanceOf(Transmission)
    expect(transmission.channel).toEqual('sms')
    expect(transmission.target).toEqual("0123456789")

    transmission = transmissions.find(transmission => transmission.channel === 'push')
    expect(transmission).toBeInstanceOf(Transmission)
    expect(transmission.channel).toEqual('push')
    expect(transmission.target).toEqual({token: "abc123"})

    transmission = transmissions.find(transmission => transmission.channel === 'callback')
    expect(transmission).toBeInstanceOf(Transmission)
    expect(transmission.channel).toEqual('callback')
    expect(transmission.target).toEqual("http://www.example.com")
  })  

  it("should return five transmissions", async () => {
    const message: Message = new Message()
    message.id = 1
    message.data = {
      template: {
        channels: {
          required: ['email', 'sms', 'push', 'callback', 'chat'],
        },
      },
      recipients: [{
        email: "info@postways.com",
        phone: "0123456789",
        push: {
          token: "abc123"
        },
        callback: "http://www.example.com",
        chat: {
          username: "bob",
          password: "s3cr3t"
        }
      }]
    }

    const revision: TemplateRevision = new TemplateRevision(1)
    revision.unserialize(message.data.template)

    const mockIntegrations: Integration[] = getMockIntegrations();

    const transmissions: Transmission[] = await transmissionService.create(message, revision, [], mockIntegrations, null)

    expect(transmissions.length).toBe(5)

    let transmission: Transmission

    transmission = transmissions.find(transmission => transmission.channel === 'email')
    expect(transmission).toBeInstanceOf(Transmission)
    expect(transmission.channel).toEqual('email')
    expect(transmission.target).toEqual("info@postways.com")

    transmission = transmissions.find(transmission => transmission.channel === 'sms')
    expect(transmission).toBeInstanceOf(Transmission)
    expect(transmission.channel).toEqual('sms')
    expect(transmission.target).toEqual("0123456789")

    transmission = transmissions.find(transmission => transmission.channel === 'push')
    expect(transmission).toBeInstanceOf(Transmission)
    expect(transmission.channel).toEqual('push')
    expect(transmission.target).toEqual({token: "abc123"})

    transmission = transmissions.find(transmission => transmission.channel === 'callback')
    expect(transmission).toBeInstanceOf(Transmission)
    expect(transmission.channel).toEqual('callback')
    expect(transmission.target).toEqual("http://www.example.com")

    transmission = transmissions.find(transmission => transmission.channel === 'chat')
    expect(transmission).toBeInstanceOf(Transmission)
    expect(transmission.channel).toEqual('chat')
    expect(transmission.target).toEqual({username: "bob", password: "s3cr3t"})
  })
})

describe('create (preferred channels)', () => {
  let idIndex: number
  let transmissionService: TransmissionService

  beforeEach(() => {
    idIndex = 0

    const MockRepository = jest.fn<TransmissionRepository>(() => ({
      persist: jest.fn((transmission: Transmission, _connection: any) => {
        idIndex++

        transmission.id = idIndex

        return transmission
      }),
    }))

    transmissionService = new TransmissionService()
    transmissionService.setUtil(new TransmissionUtil())
    transmissionService.setRepository(new MockRepository())
    transmissionService.setValidator(new TransmissionValidator())
  })

  it("should return an email transmission", async () => {
    const message: Message = new Message()
    message.id = 1
    message.data = {
      template: {
        channels: {
          preferred: ['email', 'sms', 'push', 'callback', 'chat']
        },
      },
      recipients: [{
        email: "info@postways.com",
      }]
    }

    const revision: TemplateRevision = new TemplateRevision(1)
    revision.unserialize(message.data.template)

    const mockIntegrations: Integration[] = getMockIntegrations();

    const transmissions: Transmission[] = await transmissionService.create(message, revision, [], mockIntegrations, null)

    expect(transmissions.length).toBe(1)
    expect(transmissions[0]).toBeInstanceOf(Transmission)
    expect(transmissions[0].channel).toEqual('email')
    expect(transmissions[0].target).toEqual("info@postways.com")
  })

  it("should return an sms transmission", async () => {
    const message: Message = new Message()
    message.id = 1
    message.data = {
      template: {
        channels: {
          preferred: ['email', 'sms', 'push', 'callback', 'chat']
        },
      },
      recipients: [{
        phone: "0123456789"
      }]
    }

    const revision: TemplateRevision = new TemplateRevision(1)
    revision.unserialize(message.data.template)

    const mockIntegrations: Integration[] = getMockIntegrations();

    const transmissions: Transmission[] = await transmissionService.create(message, revision, [], mockIntegrations, null)

    expect(transmissions.length).toBe(1)
    expect(transmissions[0]).toBeInstanceOf(Transmission)
    expect(transmissions[0].channel).toEqual('sms')
    expect(transmissions[0].target).toEqual("0123456789")
  })

  it("should return a push transmission", async () => {
    const message: Message = new Message()
    message.id = 1
    message.data = {
      template: {
        channels: {
          preferred: ['email', 'sms', 'push', 'callback', 'chat']
        },
      },
      recipients: [{
        push: {
          token: "abc123"
        }
      }]
    }

    const revision: TemplateRevision = new TemplateRevision(1)
    revision.unserialize(message.data.template)

    const mockIntegrations: Integration[] = getMockIntegrations();

    const transmissions: Transmission[] = await transmissionService.create(message, revision, [], mockIntegrations, null)

    expect(transmissions.length).toBe(1)
    expect(transmissions[0]).toBeInstanceOf(Transmission)
    expect(transmissions[0].channel).toEqual('push')
    expect(transmissions[0].target).toEqual({token: "abc123"})
  })

  it("should return a callback transmission", async () => {
    const message = new Message()
    message.id = 1
    message.data = {
      template: {
        channels: {
          preferred: ['email', 'sms', 'push', 'callback', 'chat']
        },
      },
      recipients: [{
        callback: "http://www.example.com"
      }]
    }

    const revision: TemplateRevision = new TemplateRevision()
    revision.unserialize(message.data.template)

    const mockIntegrations: Integration[] = getMockIntegrations();

    const transmissions: Transmission[] = await transmissionService.create(message, revision, [], mockIntegrations, null)

    expect(transmissions.length).toBe(1)
    expect(transmissions[0]).toBeInstanceOf(Transmission)
    expect(transmissions[0].channel).toEqual('callback')
    expect(transmissions[0].target).toEqual("http://www.example.com")
  })

  it("should return a chat transmission", async () => {
    const message: Message = new Message()
    message.id = 1
    message.data = {
      template: {
        channels: {
          preferred: ['email', 'sms', 'push', 'callback', 'chat']
        },
      },
      recipients: [{
        chat: {
          username: "bob",
          password: "s3cr3t"
        }
      }]
    }

    const revision: TemplateRevision = new TemplateRevision(1)
    revision.unserialize(message.data.template)

    const mockIntegrations: Integration[] = getMockIntegrations();

    const transmissions: Transmission[] = await transmissionService.create(message, revision, [], mockIntegrations)

    expect(transmissions.length).toBe(1)
    expect(transmissions[0]).toBeInstanceOf(Transmission)
    expect(transmissions[0].channel).toEqual('chat')
    expect(transmissions[0].target).toEqual({username: "bob", password: "s3cr3t"})
  })
})

describe('update', () => {
  let transmissionService: TransmissionService

  beforeEach(() => {
    const MockRepository = jest.fn<TransmissionRepository>(() => ({
      persist: jest.fn((transmission: Transmission, _connection: any) => {
        transmission.timeUpdated = Math.floor(new Date().getTime() / 1000)

        return transmission
      }),
    }))

    transmissionService = new TransmissionService()
    transmissionService.setUtil(new TransmissionUtil())
    transmissionService.setRepository(new MockRepository())
    transmissionService.setValidator(new TransmissionValidator())
  })

  it('should update correctly', async() => {
    const transmission: Transmission = new Transmission()
    transmission.id = 1
    transmission.messageId = 1
    transmission.channel = Transmission.CHANNEL_EMAIL
    transmission.target = 'info@postways.com'
    transmission.timeCreated = Math.floor(new Date().getTime() / 1000)

    const values: object = {
      channel: Transmission.CHANNEL_SMS,
      target: '061412345678',
    }

    const updatedTransmission: Transmission = await transmissionService.update(transmission, values, null)

    expect(updatedTransmission.id).toBe(1)
    expect(updatedTransmission.messageId).toBe(1)
    expect(updatedTransmission.channel).toBe(Transmission.CHANNEL_SMS)
    expect(updatedTransmission.target).toBe('061412345678')
  })

  it('should throw a validation execption', async () => {
    const transmission: Transmission = new Transmission()
    transmission.id = 1
    transmission.messageId = 1
    transmission.channel = Transmission.CHANNEL_SMS
    transmission.target = '061412345678'
    transmission.timeCreated = Math.floor(new Date().getTime() / 1000)

    // Update to unsupported channel.
    const values: object = {
      channel: 'xxx'
    }

    await expect(
      transmissionService.update(transmission, values, null)
     ).rejects.toThrow();
  })
})
