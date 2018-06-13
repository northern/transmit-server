
import Recipient from '../../Entity/Recipient'

export default class RecipientService {
  setLogger(logger) {
    this.logger = logger
  }

  create(message) {
    const recipients = []

    message.data.recipients.map(data => {
      recipients.push(
        new Recipient(data)
      )
    })

    return recipients
  }
}
