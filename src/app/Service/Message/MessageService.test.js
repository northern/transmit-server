
import Message from '../../Entity/Message'
import Transmission from '../../Entity/Transmission'
import MessageService from './MessageService'

describe('getCombinedStatus', () => {
  const messageService = new MessageService()

  it("should return STATUS_OK", () => {
    const transmissions = [
      (() => { const t = new Transmission(); t.status = Transmission.STATUS_OK; return t })(),
      (() => { const t = new Transmission(); t.status = Transmission.STATUS_OK; return t })(),
      (() => { const t = new Transmission(); t.status = Transmission.STATUS_OK; return t })(),
    ]

    const status = messageService.getCombinedStatus(transmissions)
    expect(status).toBe(Message.STATUS_OK)
  })

  it("should return STATUS_PROCESSING", () => {
    let status
    let transmissions

    transmissions = [
      (() => { const t = new Transmission(); t.status = Transmission.STATUS_RETRY; return t })(),
      (() => { const t = new Transmission(); t.status = Transmission.STATUS_OK; return t })(),
      (() => { const t = new Transmission(); t.status = Transmission.STATUS_OK; return t })(),
    ]

    status = messageService.getCombinedStatus(transmissions)
    expect(status).toBe(Message.STATUS_PROCESSING)

    transmissions = [
      (() => { const t = new Transmission(); t.status = Transmission.STATUS_OK; return t })(),
      (() => { const t = new Transmission(); t.status = Transmission.STATUS_PENDING; return t })(),
      (() => { const t = new Transmission(); t.status = Transmission.STATUS_OK; return t })(),
    ]

    status = messageService.getCombinedStatus(transmissions)
    expect(status).toBe(Message.STATUS_PROCESSING)

    transmissions = [
      (() => { const t = new Transmission(); t.status = Transmission.STATUS_OK; return t })(),
      (() => { const t = new Transmission(); t.status = Transmission.STATUS_OK; return t })(),
      (() => { const t = new Transmission(); t.status = Transmission.STATUS_PROCESSING; return t })(),
    ]

    status = messageService.getCombinedStatus(transmissions)
    expect(status).toBe(Message.STATUS_PROCESSING)

    transmissions = [
      (() => { const t = new Transmission(); t.status = Transmission.STATUS_RETRY; return t })(),
      (() => { const t = new Transmission(); t.status = Transmission.STATUS_PENDING; return t })(),
      (() => { const t = new Transmission(); t.status = Transmission.STATUS_PROCESSING; return t })(),
    ]

    status = messageService.getCombinedStatus(transmissions)
    expect(status).toBe(Message.STATUS_PROCESSING)
  })

  it("should return STATUS_WARNING", () => {
    let status
    let transmissions

    transmissions = [
      (() => { const t = new Transmission(); t.status = Transmission.STATUS_FAILED; return t })(),
      (() => { const t = new Transmission(); t.status = Transmission.STATUS_OK; return t })(),
      (() => { const t = new Transmission(); t.status = Transmission.STATUS_OK; return t })(),
    ]

    status = messageService.getCombinedStatus(transmissions)
    expect(status).toBe(Message.STATUS_WARNING)

    transmissions = [
      (() => { const t = new Transmission(); t.status = Transmission.STATUS_OK; return t })(),
      (() => { const t = new Transmission(); t.status = Transmission.STATUS_FAILED; return t })(),
      (() => { const t = new Transmission(); t.status = Transmission.STATUS_OK; return t })(),
    ]

    status = messageService.getCombinedStatus(transmissions)
    expect(status).toBe(Message.STATUS_WARNING)

    transmissions = [
      (() => { const t = new Transmission(); t.status = Transmission.STATUS_OK; return t })(),
      (() => { const t = new Transmission(); t.status = Transmission.STATUS_OK; return t })(),
      (() => { const t = new Transmission(); t.status = Transmission.STATUS_FAILED; return t })(),
    ]

    status = messageService.getCombinedStatus(transmissions)
    expect(status).toBe(Message.STATUS_WARNING)
  })

  it("should return STATUS_FAILED", () => {
    let status
    let transmissions

    transmissions = [
      (() => { const t = new Transmission(); t.status = Transmission.STATUS_FAILED; return t })(),
      (() => { const t = new Transmission(); t.status = Transmission.STATUS_FAILED; return t })(),
      (() => { const t = new Transmission(); t.status = Transmission.STATUS_FAILED; return t })(),
    ]

    status = messageService.getCombinedStatus(transmissions)
    expect(status).toBe(Message.STATUS_FAILED)
  })
})
