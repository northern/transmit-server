
import ISerializer from '../../ISerializer'

export default class Test implements ISerializer {
  public vars: object | null

  constructor(vars: object | null = null) {
    this.vars = vars
  }

  serialize(): object {
    return {
      vars: this.vars
    }
  }

  unserialize(data: object | null): void {
    if (!data) {
      data = {}
    }

    const map: Map<string, any> = new Map(Object.entries(data))

    this.vars = map.get('vars') || null
  }
}
