
import Category from './Category'

describe("Entity/Template/Category", () => {
  it("should instantiate without constructor parameters", () => {
    const category: Category = new Category()

    expect(category.name).toBeNull()
    expect(category.title).toBeNull()
  })

  it("should instantiate with constructor parameters", () => {
    const category: Category = new Category('default name', 'default title')

    expect(category.name).toEqual('default name')
    expect(category.title).toEqual('default title')
  })

  it("should serialize", () => {
    const category: Category = new Category('default name', 'default title')

    const data: object = category.serialize()

    expect(data).toBeInstanceOf(Object)

    const map: Map<string, any> = new Map(Object.entries(data))

    expect(map.get('name')).toEqual('default name')
    expect(map.get('title')).toEqual('default title')
  })

  it("should unserialize", () => {
    const category: Category = new Category()

    category.unserialize(null)

    expect(category.name).toBeNull()
    expect(category.title).toBeNull()

    const data: object = {
      name: 'default name',
      title: 'default title',
    }

    category.unserialize(data)

    expect(category.name).toEqual('default name')
    expect(category.title).toEqual('default title')
  })
})
