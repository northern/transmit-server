
/**
 * A simple service locator, a.k.a dependency injection container (DIC).
 */
export default class Container {
  services: Map<string, any>

  constructor() {
    this.services = new Map()
  }

  /**
   * Register a new service. Use the "lazy" option to spawn the instance at
   * request time rather than initialization time.
   * 
   * @param name The name of the service (must be unique)
   * @param callback A function that returns the service instance
   * @param lazy If the service is lazy loaded.
   */
  service(name: string, callback: Function, lazy: boolean = false): void {
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

  /**
   * Register a factory. A factory always returns a new instance.
   * 
   * @param name The name of the factory (must be unique)
   * @param callback A function that returns the factory instance
   */
  factory(name: string, callback: Function): void {
    if (this.services.has(name)) {
      throw new Error(`Service with name '${name}' already exists.`)
    }

    this.services.set(name, callback)
  }

  /**
   * Returns an instance of the service or factory.
   * 
   * @param name The name of the service or factory to get the instance of.
   */
  get(name: string): any {
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
