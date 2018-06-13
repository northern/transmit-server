
import Recipient from '../../Entity/Recipient'

export default class RecipientService {
  setLogger(logger) {
    this.logger = logger
  }

  create(message) {
    const recipients = []

    message.data.recipients.map(data => {
      const recipient = new Recipient()
      recipient.email = data.email || null
      recipient.phone = data.phone || null
      recipient.push = data.push || null
      recipient.callback = data.callback || null
      recipient.chat = data.chat || null
      recipient.vars = data.vars || null
      
      recipients.push(recipient)
    })

    return recipients
  }
}
