
import ILogger from '../../ILogger'
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

class MockLogger implements ILogger {
  info(_message: string): void {}
}

describe('setters', () => {
  let transmission: TransmissionService

  beforeEach(() => {
     transmission = new TransmissionService()
  })

  it('should the logger', () => {
    transmission.setLogger(new MockLogger())
  })
})

describe('getById', () => {
  it('should return a transmission', async() => {
    const MockRepository = jest.fn<TransmissionRepository>(() => ({
      getById: jest.fn((id: string, _connection: any) => {
        const transmission = new Transmission(1, Transmission.CHANNEL_EMAIL)
        transmission.id = id

        return transmission
      }),
    }))

    const transmissionService: TransmissionService = new TransmissionService()
    transmissionService.setRepository(new MockRepository())

    const transmission = await transmissionService.getById(1, null)

    expect(transmission).toBeInstanceOf(Transmission)
    expect(transmission.id).toBe(1)
    expect(transmission.status).toBe(Transmission.STATUS_PENDING)
    expect(transmission.channel).toBe(Transmission.CHANNEL_EMAIL)
  })

  it('should throw an exception', async() => {
    const MockRepository = jest.fn<TransmissionRepository>(() => ({
      getById: jest.fn((_id: string, _connection: any) => {
        return null
      }),
    }))

    const transmissionService: TransmissionService = new TransmissionService()
    transmissionService.setRepository(new MockRepository())

    await expect(
      transmissionService.getById(1, null)
    ).rejects.toThrow();    
  })
})

describe('getByMessageId', () => {
  it('should return tranmissions', async() => {
    const MockRepository = jest.fn<TransmissionRepository>(() => ({
      getByMessageId: jest.fn((_id: string, _connection: any) => {
        return [
          new Transmission(1, Transmission.CHANNEL_EMAIL),
          new Transmission(1, Transmission.CHANNEL_EMAIL),
        ]
      }),
    }))

    const transmissionService: TransmissionService = new TransmissionService()
    transmissionService.setRepository(new MockRepository())

    const transmissions = await transmissionService.getByMessageId(1, null)

    expect(transmissions).toBeInstanceOf(Array)
    expect(transmissions.length).toBe(2)
  })
})

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

  it("should create one transmission", async () => {
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

    const transmissions = await transmissionService.create(message, revision, mockIntegrations, [], null)

    expect(transmissions.length).toBe(1)
    expect(transmissions[0].id).toEqual(1)
    expect(transmissions[0].channel).toEqual('email')
    expect(transmissions[0].target).toEqual("info@postways.com")
  })

  it("should create two transmissions", async () => {
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

    const transmissions: Transmission[] = await transmissionService.create(message, revision, mockIntegrations, [], null)

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

  it("should create three transmissions", async () => {
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

    const transmissions: Transmission[] = await transmissionService.create(message, revision, mockIntegrations, [], null)

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

  it("should create four transmissions", async () => {
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

    const transmissions: Transmission[] = await transmissionService.create(message, revision, mockIntegrations, [], null)

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

  it("should create five transmissions", async () => {
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

    const transmissions: Transmission[] = await transmissionService.create(message, revision, mockIntegrations, [], null)

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

  it("should create an email transmission", async () => {
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

    const transmissions: Transmission[] = await transmissionService.create(message, revision, mockIntegrations, [], null)

    expect(transmissions.length).toBe(1)
    expect(transmissions[0]).toBeInstanceOf(Transmission)
    expect(transmissions[0].channel).toEqual('email')
    expect(transmissions[0].target).toEqual("info@postways.com")
  })

  it("should create an sms transmission", async () => {
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

    const transmissions: Transmission[] = await transmissionService.create(message, revision, mockIntegrations, [], null)

    expect(transmissions.length).toBe(1)
    expect(transmissions[0]).toBeInstanceOf(Transmission)
    expect(transmissions[0].channel).toEqual('sms')
    expect(transmissions[0].target).toEqual("0123456789")
  })

  it("should create a push transmission", async () => {
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

    const transmissions: Transmission[] = await transmissionService.create(message, revision, mockIntegrations, [], null)

    expect(transmissions.length).toBe(1)
    expect(transmissions[0]).toBeInstanceOf(Transmission)
    expect(transmissions[0].channel).toEqual('push')
    expect(transmissions[0].target).toEqual({token: "abc123"})
  })

  it("should create a callback transmission", async () => {
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

    const transmissions: Transmission[] = await transmissionService.create(message, revision, mockIntegrations, [], null)

    expect(transmissions.length).toBe(1)
    expect(transmissions[0]).toBeInstanceOf(Transmission)
    expect(transmissions[0].channel).toEqual('callback')
    expect(transmissions[0].target).toEqual("http://www.example.com")
  })

  it("should create a chat transmission", async () => {
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

    const transmissions: Transmission[] = await transmissionService.create(message, revision, mockIntegrations, [], null)

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
    const transmission: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL)
    transmission.id = 1
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

  it('should throw a validation exeception', async () => {
    const transmission: Transmission = new Transmission(1, Transmission.CHANNEL_SMS)
    transmission.id = 1
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

class MockProvider implements IProvider {
  getCapabilities(): Array<string> {
    return [Integration.CHANNEL_EMAIL, Integration.CHANNEL_SMS]
  }

  async send(_channel: string, _title: string, _body: string, _extra: object | null): Promise<void> {
    // console.info("channel", _channel)
    // console.info("title", _title)
    // console.info("body", _body)
    // console.info("extra", _extra)
  }
}

class MockProviderWithError implements IProvider {
  getCapabilities(): Array<string> {
    return [Integration.CHANNEL_EMAIL, Integration.CHANNEL_SMS]
  }

  async send(_channel: string, _title: string, _body: string, _extra: object | null): Promise<void> {
    throw new Error("Kapoot")
  }
}

describe('send', () => {
  let transmissionService: TransmissionService

  beforeEach(() => {
    transmissionService = new TransmissionService()
    transmissionService.setUtil(new TransmissionUtil())
  })

  it('should send a plain text email transmission', async () => {
    const transmission: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL)
    transmission.target = 'test@example.com'

    const message: Message = new Message()
    message.data = {
      template: {
        channels: {
          preferred: ['email']
        },
        defaults: {
          title: 'Default title',
          body: 'Default body'
        }
      }
    }

    const revision: TemplateRevision = new TemplateRevision(1)
    revision.unserialize(message.data.template)

    const integration: Integration = new Integration(Integration.CHANNEL_EMAIL, new MockProvider())

    const senderDefaults = {
      id: 'postways',
      from: 'Postways',
      email: 'info@postways.com',
    };

    await transmissionService.send(transmission, revision, integration, {}, new Map(Object.entries(senderDefaults)))
  })

  it('should send a html email transmission', async () => {
    const transmission: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL)
    transmission.target = 'test@example.com'

    const message: Message = new Message()
    message.data = {
      template: {
        channels: {
          preferred: ['email']
        },
        defaults: {
          title: 'Default title',
          body: 'Default body'
        },
        email: {
          body: '<html>HTML body</html>',
          isHtml: true,
        }
      }
    }

    const revision: TemplateRevision = new TemplateRevision(1)
    revision.unserialize(message.data.template)

    const integration: Integration = new Integration(Integration.CHANNEL_EMAIL, new MockProvider())

    const senderDefaults = {
      id: 'postways',
      from: 'Postways',
      email: 'info@postways.com',
    };

    await transmissionService.send(transmission, revision, integration, {}, new Map(Object.entries(senderDefaults)))
  })

  it('should send sms transmission', async () => {
    const transmission: Transmission = new Transmission(1, Transmission.CHANNEL_SMS)
    transmission.target = '+610212345678'

    const message: Message = new Message()
    message.data = {
      template: {
        channels: {
          preferred: ['sms']
        },
        defaults: {
          title: 'Default title',
          body: 'Default body'
        }
      }
    }

    const revision: TemplateRevision = new TemplateRevision(1)
    revision.unserialize(message.data.template)

    const integration: Integration = new Integration(Integration.CHANNEL_SMS, new MockProvider())

    const senderDefaults = {
      id: 'postways',
    };

    await transmissionService.send(transmission, revision, integration, {}, new Map(Object.entries(senderDefaults)))
  })

  it('should throw an error on send', async () => {
    const transmission: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL)
    transmission.target = 'test@example.com'

    const message: Message = new Message()
    message.data = {
      template: {
        channels: {
          preferred: ['email']
        },
        defaults: {
          title: 'Default title',
          body: 'Default body'
        }
      }
    }

    const revision: TemplateRevision = new TemplateRevision(1)
    revision.unserialize(message.data.template)

    const integration: Integration = new Integration(Integration.CHANNEL_EMAIL, new MockProviderWithError())

    const senderDefaults = {
      id: 'postways',
      from: 'Postways',
      email: 'info@postways.com',
    };

    await expect(
      transmissionService.send(transmission, revision, integration, {}, new Map(Object.entries(senderDefaults)))
    ).rejects.toThrow();
  })
})
