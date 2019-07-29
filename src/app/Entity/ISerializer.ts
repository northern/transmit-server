
export default interface ISerializer {
  serialize(): object
  unserialize(data: object | null): void
}
