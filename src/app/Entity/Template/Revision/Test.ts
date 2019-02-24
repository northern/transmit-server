
import Serializable from '../../Serializable'

export default class Test implements Serializable {
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
