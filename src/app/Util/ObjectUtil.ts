
export interface IObject {
  [key: string]: any;
}

export default class ObjectUtil {
  static filter(o: IObject, keys: string[]): object {
    keys.map(k => delete o[k])

    return o
  }
}
