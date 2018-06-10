
export default class PersistenceService {
  static get TYPE_MYSQL() {
    return 'mysql'
  }
  
  setLogger(logger) {
    this.logger = logger
  }

  setProvider(provider) {
    this.provider = provider
  }

  async getConnection() {
    return await this.provider.getConnection()
  }

  async beginTransaction() {
    const connection = await this.provider.getConnection()

    this.provider.beginTransaction(connection)

    return connection
  }

  async commit(connection) {
    await this.provider.commit(connection)
  }

  async rollback(connection) {
    if (connection) {
      await this.provider.rollback(connection)
    }
  }

  async releaseConnection(connection) {
    if (connection) {
      await this.provider.releaseConnection(connection)
    }
  }
}
