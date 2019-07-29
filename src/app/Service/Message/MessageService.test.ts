
import ILogger from '../../ILogger'
import Message from '../../Entity/Message'
import Transmission from '../../Entity/Transmission'
import MessageService from './MessageService'
import MessageRepository from './MessageRepository'
import MessageValidator from './MessageValidator'

class MockLogger implements ILogger {
  info(_message: string): void {}
}

describe('setters', () => {
  let messageService: MessageService

  beforeEach(() => {
     messageService = new MessageService()
  })

  it('should the logger', () => {
    messageService.setLogger(new MockLogger())
  })
})

describe('getById', () => {
  let messageService: MessageService

  beforeEach(() => {
     messageService = new MessageService()
  })

  it('should get a message by id', async () => {
    const MockRepository = jest.fn<MessageRepository>(() => ({
      getById: jest.fn((id: string, _connection: any) => {
        const message = new Message()
        message.id = id

        return message
      }),
    }))
    
    messageService.setRepository(new MockRepository())

    const message = await messageService.getById(1, null)

    expect(message).toBeInstanceOf(Message)
    expect(message.id).toBe(1)
  })

  it('should throw a not found exception', async () => {
    const MockRepository = jest.fn<MessageRepository>(() => ({
      getById: jest.fn((id: string, _connection: any) => {
        return null
      }),
    }))
    
    messageService.setRepository(new MockRepository())

    await expect(
      messageService.getById(1, null)
    ).rejects.toThrow(); 
  })
})

describe('create', () => {
  let messageService: MessageService

  beforeEach(() => {
     messageService = new MessageService()
  })

  it('should create a message', async () => {
    const MockRepository = jest.fn<MessageRepository>(() => ({
      persist: jest.fn((message: Message, _connection: any) => {
        message.id = 1
        message.timeCreated = Math.floor(new Date().getTime() / 1000)

        return message
      }),
    }))
    
    messageService.setRepository(new MockRepository())
    messageService.setValidator(new MessageValidator())

    const data = {
      template: {
        channels: {
          required: ['email'],
        },
      },
      recipients: [{
        email: "info@postways.com",
      }]
    }

    const message = await messageService.create(data, 'test', null)

    expect(message).toBeInstanceOf(Message)
    expect(message.id).not.toBe(null)
    expect(message.timeCreated).not.toBe(null)
    expect(message.timeUpdated).toBe(null)
  })
})

describe('update', () => {
  let messageService: MessageService

  beforeEach(() => {
     messageService = new MessageService()
  })

  it('should update a message', async () => {
    const MockRepository = jest.fn<MessageRepository>(() => ({
      persist: jest.fn((message: Message, _connection: any) => {
        message.timeUpdated = Math.floor(new Date().getTime() / 1000)

        return message
      }),
    }))
    
    messageService.setRepository(new MockRepository())
    messageService.setValidator(new MessageValidator())

    const values: object = {
      id: 0,
      data: {},
      timeCreated: 0,
      timeUpdated: 0,
      environment: 'test',
      status: Message.STATUS_PENDING,
    }

    let message: Message = new Message()
    message.id = 1
    message.timeCreated = 1
    message.timeUpdated = 1
    message.environment = 'dev'

    message = await messageService.update(message, values, null)

    expect(message).toBeInstanceOf(Message)
    expect(message.id).toBe(1)
    expect(message.timeCreated).toBe(1)
    expect(message.timeUpdated).not.toBe(1)
    expect(message.environment).toBe('test')
  })

  it('should throw an error', async () => {
    messageService.setValidator(new MessageValidator())

    const values: object = {
      id: 0,
      data: {},
      timeCreated: 0,
      timeUpdated: 0,
      status: 'invalid',
    }

    let message: Message = new Message()
    message.id = 1
    message.timeCreated = 1
    message.timeUpdated = 1

    await expect(
      messageService.update(message, values, null)
    ).rejects.toThrow();
  })
})

describe('getTemplateVars', () => {
  let messageService: MessageService

  beforeEach(() => {
     messageService = new MessageService()
  })

  it('should get the template vars', () => {
    const message: Message = new Message()

    const vars: object | null = messageService.getTemplateVars(message)

    expect(vars).toBeNull()
  })
})

describe('getCombinedStatus', () => {
  let messageService: MessageService

  beforeEach(() => {
     messageService = new MessageService()
  })

  it("should return STATUS_OK", () => {
    const transmissions: Transmission[] = [
      (() => { const t: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL); t.status = Transmission.STATUS_OK; return t })(),
      (() => { const t: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL); t.status = Transmission.STATUS_OK; return t })(),
      (() => { const t: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL); t.status = Transmission.STATUS_OK; return t })(),
    ]

    const status = messageService.getCombinedStatus(transmissions)
    expect(status).toBe(Message.STATUS_OK)
  })

  it("should return STATUS_PROCESSING", () => {
    let status
    let transmissions

    transmissions = [
      (() => { const t: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL); t.status = Transmission.STATUS_RETRY; return t })(),
      (() => { const t: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL); t.status = Transmission.STATUS_OK; return t })(),
      (() => { const t: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL); t.status = Transmission.STATUS_OK; return t })(),
    ]

    status = messageService.getCombinedStatus(transmissions)
    expect(status).toBe(Message.STATUS_PROCESSING)

    transmissions = [
      (() => { const t: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL); t.status = Transmission.STATUS_OK; return t })(),
      (() => { const t: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL); t.status = Transmission.STATUS_PENDING; return t })(),
      (() => { const t: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL); t.status = Transmission.STATUS_OK; return t })(),
    ]

    status = messageService.getCombinedStatus(transmissions)
    expect(status).toBe(Message.STATUS_PROCESSING)

    transmissions = [
      (() => { const t: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL); t.status = Transmission.STATUS_OK; return t })(),
      (() => { const t: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL); t.status = Transmission.STATUS_OK; return t })(),
      (() => { const t: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL); t.status = Transmission.STATUS_PROCESSING; return t })(),
    ]

    status = messageService.getCombinedStatus(transmissions)
    expect(status).toBe(Message.STATUS_PROCESSING)

    transmissions = [
      (() => { const t: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL); t.status = Transmission.STATUS_RETRY; return t })(),
      (() => { const t: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL); t.status = Transmission.STATUS_PENDING; return t })(),
      (() => { const t: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL); t.status = Transmission.STATUS_PROCESSING; return t })(),
    ]

    status = messageService.getCombinedStatus(transmissions)
    expect(status).toBe(Message.STATUS_PROCESSING)
  })

  it("should return STATUS_WARNING", () => {
    let status
    let transmissions

    transmissions = [
      (() => { const t: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL); t.status = Transmission.STATUS_FAILED; return t })(),
      (() => { const t: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL); t.status = Transmission.STATUS_OK; return t })(),
      (() => { const t: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL); t.status = Transmission.STATUS_OK; return t })(),
    ]

    status = messageService.getCombinedStatus(transmissions)
    expect(status).toBe(Message.STATUS_WARNING)

    transmissions = [
      (() => { const t: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL); t.status = Transmission.STATUS_OK; return t })(),
      (() => { const t: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL); t.status = Transmission.STATUS_FAILED; return t })(),
      (() => { const t: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL); t.status = Transmission.STATUS_OK; return t })(),
    ]

    status = messageService.getCombinedStatus(transmissions)
    expect(status).toBe(Message.STATUS_WARNING)

    transmissions = [
      (() => { const t: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL); t.status = Transmission.STATUS_OK; return t })(),
      (() => { const t: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL); t.status = Transmission.STATUS_OK; return t })(),
      (() => { const t: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL); t.status = Transmission.STATUS_FAILED; return t })(),
    ]

    status = messageService.getCombinedStatus(transmissions)
    expect(status).toBe(Message.STATUS_WARNING)
  })

  it("should return STATUS_FAILED", () => {
    let status
    let transmissions

    transmissions = [
      (() => { const t: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL); t.status = Transmission.STATUS_FAILED; return t })(),
      (() => { const t: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL); t.status = Transmission.STATUS_FAILED; return t })(),
      (() => { const t: Transmission = new Transmission(1, Transmission.CHANNEL_EMAIL); t.status = Transmission.STATUS_FAILED; return t })(),
    ]

    status = messageService.getCombinedStatus(transmissions)
    expect(status).toBe(Message.STATUS_FAILED)
  })
})
