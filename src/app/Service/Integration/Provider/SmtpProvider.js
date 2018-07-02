
import nodemailer from 'nodemailer'

import AbstractProvider from './AbstractProvider'
import Transmission from  '../../../Entity/Transmission'

export default class SmtpProvider extends AbstractProvider {
  constructor(config) {
    super()
    
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
    return [
      Transmission.CHANNEL_EMAIL,
    ]
  }

  async send(channel, title, body, extra = {}) {
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
      this.transporter.sendMail(options, (error, data) => {
        if (error) {
          reject(error)
        }
        else {
          resolve(data)
        }
      })
    })
  }
}
