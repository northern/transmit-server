
import Foo from './Foo'

describe('Foo', () => {
  it("should pass", () => {
    const MockFoo = jest.fn<Foo>(() => ({
      bar: jest.fn(() => {
        return 123
      }),
    }))

    const foo = new MockFoo()

    expect(foo.bar()).toBe(123)
  })
})
