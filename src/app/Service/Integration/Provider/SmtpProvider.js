
export default class SmtpProvider {
  constructor(config) {

  }

  async send(title, body, extra = {}) {
    console.log("title", title)
    console.log("body", body)
    console.log("%o", extra)
  }
}
