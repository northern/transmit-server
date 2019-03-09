
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
  })

  it('should get channels', () => {
    const statuses = Template.getChannels()

    expect(statuses).toBeInstanceOf(Array)
    expect(statuses.length).toBe(5)
  })

  it('should get engines', () => {
    const statuses = Template.getEngines()

    expect(statuses).toBeInstanceOf(Array)
    expect(statuses.length).toBe(1)
  })
})
