
export default class JSONUtil {
  static parseSafe(s) {
    try {
      return JSON.parse(s)
    }
    catch(err) {
    }

    return s
  }  
}
