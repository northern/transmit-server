
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
    const data: object = {
      vars: {
        foo: 'bar'
      }
    }

    const test: Test = new Test()
    test.unserialize(data)

    expect(test.vars).toEqual({foo: 'bar'})
  })
})
