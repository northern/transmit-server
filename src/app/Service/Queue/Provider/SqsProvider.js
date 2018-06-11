
import Aws from 'aws-sdk'
import AbstractProvider from './AbstractProvider'

export default class SqsProvider extends AbstractProvider {
  static getSqsClient(version, region, credentials) {
    const sqsClient = new Aws.SQS({
      region,
      version,
      credentials,
    })

    return sqsClient
  }

  setSqsClient(sqsClient) {
    this.sqsClient = sqsClient
  }

  setQueueUrl(queueUrl) {
    this.queueUrl = queueUrl
  }

  async add(message) {
    let payload = message

    if (message instanceof Object) {
      payload = JSON.stringify(message)
    }

    const params = {
      MessageBody: payload,
      QueueUrl: this.queueUrl,
      //DelaySeconds: 0,
    }

    return new Promise((resolve, reject) => {
      this.sqsClient.sendMessage(params, (err, result) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(result)
        }
      })
    })
  }

  async get() {
    
  }
}
