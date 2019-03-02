
import ILogger from '../../ILogger'
import IStorage from './Storage/IStorage'
import Transmission from '../../Entity/Transmission'

export default class TransmissionRepository {
  private logger: ILogger
  private storage: IStorage

  setLogger(logger: ILogger): void {
    this.logger = logger
  }

  setStorage(storage: IStorage): void {
    this.storage = storage
  }

  async getById(id: string, connection: any): Promise<Transmission | null> {
    return this.storage.getById(id, connection)
  }

  async getByMessageId(id: string, connection: any): Promise<Transmission[]> {
    return this.storage.getByMessageId(id, connection)
  }

  async persist(transmission: Transmission, connection: any): Promise<Transmission> {
    return this.storage.persist(transmission, connection)
  }
}
