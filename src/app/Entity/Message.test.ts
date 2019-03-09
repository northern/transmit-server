
import Message from './Message'

describe("Entity/Message", () => {
  it("should instantiate without a constructor parameters", () => {
    const template: Message = new Message()

    expect(template).toBeInstanceOf(Message)
  })

  it('should get statuses', () => {
    const statuses = Message.getStatuses()

    expect(statuses).toBeInstanceOf(Array)
    expect(statuses.length).toBe(7)
  })
})
