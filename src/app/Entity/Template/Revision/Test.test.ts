
import Test from './Test'

describe("Entity/Template/Revision/Test", () => {
  it("should instantiate without constructor parameters", () => {
    const test: Test = new Test()

    expect(test.vars).toBeNull()
  })

  it("should instantiate with constructor parameters", () => {
    const test: Test = new Test({foo: 'bar'})

    expect(test.vars).toEqual({foo: 'bar'})
  })

  it("should serialize", () => {
    const test: Test = new Test({foo: 'bar'})

    const data: object = test.serialize()

    expect(data).toBeInstanceOf(Object)

    const map: Map<string, any> = new Map(Object.entries(data))

    expect(map.get('vars')).toEqual({foo: 'bar'})
  })

  it("should unserialize", () => {
    const test: Test = new Test()

    test.unserialize(null)

    expect(test.vars).toBeNull()

    const data: object = {
      vars: {
        foo: 'bar'
      }
    }

    test.unserialize(data)

    expect(test.vars).toEqual({foo: 'bar'})
  })
})
