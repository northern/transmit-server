
import Template from './Template'

describe("Entity/Template", () => {
  it("should instantiate without a constructor parameters", () => {
    const template: Template = new Template()

    expect(template).toBeInstanceOf(Template)
  })

  it("should instantiate with a constructor parameters", () => {
    const data = {
      template: {
        channels: {
          required: ['email'],
        }
      }
    }

    const template: Template = new Template(data.template)

    expect(template).toBeInstanceOf(Template)
  })

  it('should get statuses', () => {
    const statuses = Template.getStatuses()

    expect(statuses).toBeInstanceOf(Array)
    expect(statuses.length).toBe(2)
    expect(statuses).toContain(Template.STATUS_ACTIVE)
    expect(statuses).toContain(Template.STATUS_DELETED)
  })

  it('should get channels', () => {
    const channels = Template.getChannels()

    expect(channels).toBeInstanceOf(Array)
    expect(channels.length).toBe(5)
    expect(channels).toContain(Template.CHANNEL_TYPE_EMAIL)
    expect(channels).toContain(Template.CHANNEL_TYPE_SMS)
    expect(channels).toContain(Template.CHANNEL_TYPE_PUSH)
    expect(channels).toContain(Template.CHANNEL_TYPE_CALLBACK)
    expect(channels).toContain(Template.CHANNEL_TYPE_CHAT)
  })

  it('should get engines', () => {
    const engines = Template.getEngines()

    expect(engines).toBeInstanceOf(Array)
    expect(engines.length).toBe(1)
    expect(engines).toContain(Template.ENGINE_TWIG)
  })
})
