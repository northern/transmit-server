
import ISerializer from '../../ISerializer'
import Body from './Email/Body'

export default class Email implements ISerializer {
  public title: string | null
  public senderName: string | null
  public senderEmail: string | null
  public body: Body
  public isHtml: boolean

  constructor(
    title: string | null = null,
    senderName: string | null = null,
    senderEmail: string | null = null,
    body: Body = new Body(),
    isHtml: boolean = false
   ) {
    this.title = title
    this.senderName = senderName
    this.senderEmail = senderEmail
    this.body = body
    this.isHtml = isHtml
  }

  getSenderName(defaultName: string): string {
    return this.senderName || defaultName
  }

  getSenderEmail(defaultEmail: string): string {
    return this.senderEmail || defaultEmail
  }

  serialize(): object {
    return {
      title: this.title,
      senderName: this.senderName,
      senderEmail: this.senderEmail,
      body: this.body.serialize(),
      isHtml: this.isHtml,
    }
  }

  unserialize(data: object | null): void {
    if (!data) {
      data = {}
    }

    const map: Map<string, any> = new Map(Object.entries(data))

    this.title = map.get('title') || null
    this.senderName = map.get('senderName') || null
    this.senderEmail = map.get('senderEmail') || null
    
    this.body = new Body()
    this.body.unserialize(map.get('body') || null)
    
    this.isHtml = <boolean>(map.get('isHtml') || false)
  }
}
