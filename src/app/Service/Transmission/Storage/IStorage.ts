
import Transmission from '../../../Entity/Transmission'

export default interface IStorage {
  getById(id: string, connection: any): Promise<Transmission | null>
  getByMessageId(id: string, connection: any): Promise<Transmission[]>
  persist(transmission: Transmission, connection: any): Promise<Transmission>
}
