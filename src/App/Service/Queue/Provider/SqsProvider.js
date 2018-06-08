
import Aws from 'aws-sdk'
import AbstractProvider from './AbstractProvider'

export default class SqsProvider extends AbstractProvider {
  setSqs(sqs) {
    this.sqs = sqs
  }

  async add(message) {
    console.log("Adding message", message)
  }

  async get() {
    
  }
}
