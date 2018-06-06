
import util from 'util'

export default class MySqlStorage {
  setLogger(logger) {
    this.logger = logger
  }

  setConnection(connection) {
    this.connection = connection

    this.connection.query = util.promisify(this.connection.query)
    this.connection.beginTransaction = util.promisify(this.connection.beginTransaction)
    this.connection.commit = util.promisify(this.connection.commit)
    this.connection.rollback = util.promisify(this.connection.rollback)
  }

  getById(id) {
    return {
      id: id
    }
  }

  async persist(transmission) {
    if (transmission.id) {
      // Update
    }
    else {
      // Insert
    }

    return transmission
  }

  async beginTransaction() {
    await this.connection.beginTransaction()
  }

  async commit() {
    await this.connection.commit()
  }

  async rollback() {
    await this.connection.rollback()
  }
}
