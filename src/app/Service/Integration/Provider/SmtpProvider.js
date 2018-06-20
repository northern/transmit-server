
import nodemailer from 'nodemailer'

export default class SmtpProvider {
  constructor(config) {
    this.transporter = nodemailer.createTransport({
      host: config.endpoint,
      port: config.port,
      secure: config.isSecure,
      auth: {
        user: config.username,
        pass: config.password,
      }
    })

    this.config = config
  }

  getCapabilities() {
    return ['email']
  }

  async send(title, body, extra = {}) {
    const options = {
      from: extra.from,
      to: extra.to,
      subject: title,
      text: extra.isHtml ? extra.alternateBody : body,
    };

    if (extra.isHtml) {
      options.html = body
    }

    return new Promise((resolve, reject) => {
      this.transporter.sendMail(options, (error, info) => {
        if (error) {
          reject(error)
        }
        else {
          resolve(info)
        }
      });
    })
  }
}
