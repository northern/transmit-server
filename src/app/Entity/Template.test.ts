
import Template from './Template'

describe("Entity/Template", () => {
  it("should instantiate with constructor parameters", () => {
    const template: Template = new Template()

    expect(template).toBeInstanceOf(Template)
  })
})
