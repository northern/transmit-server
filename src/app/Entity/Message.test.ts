
import Message from './Message'

describe("Entity/Message", () => {
  it("should instantiate without a constructor parameters", () => {
    const message: Message = new Message()

    expect(message).toBeInstanceOf(Message)
  })

  it('should get statuses', () => {
    const statuses = Message.getStatuses()

    expect(statuses).toBeInstanceOf(Array)
    expect(statuses.length).toBe(7)
  })
})
