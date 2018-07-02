
import _ from 'lodash'
import Aws from 'aws-sdk'

import AbstractProvider from './AbstractProvider'
import Transmission from  '../../../Entity/Transmission'

export default class AwsProvider extends AbstractProvider {
  constructor(config) {
    super()

    this.config = config
  }

  getCapabilities() {
    return [
      Transmission.CHANNEL_EMAIL,
      Transmission.CHANNEL_SMS,
      Transmission.CHANNEL_PUSH,
    ]
  }

  send(channel, title, body, extra = {}) {
    switch (channel) {
      case Transmission.CHANNEL_EMAIL: {
        const client = new Aws.SES({
          region: this.config.awsClientRegion,
          version: this.config.awsClientVersion,
          credentials: {
            accessKeyId: this.config.awsClientKey, 
            secretAccessKey: this.config.awsClientSecret,
          },
        })

        const params = {
          'Source': extra.from,
          'Destination': {
            'ToAddresses': [extra.to],
          },
          'Message': {
            'Subject': {
              'Data': title,
              'Charset': 'UTF-8',
            },
            'Body': {
              'Text': {
                'Data': extra.isHtml ? extra.alternateBody : body,
                'Charset': 'UTF-8',
              },
            },
          },
        }

        if (extra.isHtml) {
            _.set(params, 'Message.Body.Html.Data', body)
            _.set(params, 'Message.Body.Html.Charset', 'UTF-8')
        }

        new Promise((resolve, reject) => {
          client.sendEmail(params, (err, data) => {
            if (err) {
              reject(err)
            }
            else {
              resolve(data)
            }
          })
        })
        .then(data => {
          console.log(data)
        })
        .catch(err => {
          console.log(err)
        })            
      }
      break;

      case Transmission.CHANNEL_SMS: {
        const client = new Aws.SNS({
          region: this.config.awsClientRegion,
          version: this.config.awsClientVersion,
          credentials: {
            accessKeyId: this.config.awsClientKey, 
            secretAccessKey: this.config.awsClientSecret,
          },
        })

        const params = {
          'PhoneNumber': extra.phone,
          'Message': body,
          'MessageAttributes': {
            'AWS.SNS.SMS.SenderID': {
              'DataType': 'String',
              'StringValue': extra.senderId,
            },
            'AWS.SNS.SMS.SMSType': {
              'DataType': 'String',
              'StringValue': 'Transactional',
            },
          },
        };

        new Promise((resolve, reject) => {
          client.publish(params, (err, data) => {
            if (err) {
              reject(err)
            }
            else {
              resolve(data)
            }
          })
        })
        .then(data => {
          console.log(data)
        })
        .catch(err => {
          console.log(err)
        })
      }
      break
    }
  }
}
