
export default class MySqlRepository {
  setLogger(logger) {
    this.logger = logger
  }

  getById(id) {
    return {
      id: id
    }
  }  
}
