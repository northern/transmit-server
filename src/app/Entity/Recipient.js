
export default class Recipient {
  constructor(data) {
    this.email = data.email || null
    this.phone = data.phone || null
    this.push = data.push || null
    this.callback = data.callback || null
    this.chat = data.chat || null
  }
}
