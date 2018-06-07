
export default class PersistanceService {
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
    await this.provider.rollback(connection)
  }

  releaseConnection(connection) {
    this.provider.releaseConnection(connection)
  }  
}
