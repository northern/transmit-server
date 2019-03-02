
export default class JsonUtil {
  static parseSafe(s: string): any {
    try {
      return JSON.parse(s)
    }
    catch(err) {
    }

    return s
  }  
}
