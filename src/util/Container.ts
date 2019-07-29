
export default class Container {
  services: Map<any, any>

  constructor() {
    this.services = new Map()
  }

  service(name: string, callback: Function, lazy: boolean = false) {
    if (this.services.has(name)) {
      throw new Error(`Service with name '${name}' already exists.`)
    }

    if (lazy) {
      this.services.set(name, (container: Container) => {
        return this.services.set(name, callback.call(null, container))
      });
    }
    else {
      this.services.set(name, callback.call(null, this))
    }
  }

  factory(name: string, callback: Function) {
    if (this.services.has(name)) {
      throw new Error(`Service with name '${name}' already exists.`)
    }

    this.services.set(name, callback)
  }

  get(name: string) {
    if (!this.services.has(name)) {
      throw new Error(`Service with name '${name}' already exists.`)
    }

    const service: any = this.services.get(name)

    if (service instanceof Function) {
      return service.call(null, this)
    }

    return service
  }
}
