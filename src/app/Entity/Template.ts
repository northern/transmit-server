
import Category from './Template/Category'
import Revision from './Template/Revision'
import Channels from './Template/Revision/Channels'

export default class Template {
  static get CHANNEL_TYPE_EMAIL() {
    return Channels.TYPE_EMAIL
  }

  static get CHANNEL_TYPE_SMS() {
    return Channels.TYPE_SMS
  }

  static get CHANNEL_TYPE_PUSH() {
    return Channels.TYPE_PUSH
  }

  static get CHANNEL_TYPE_CALLBACK() {
    return Channels.TYPE_CALLBACK
  }

  static get CHANNEL_TYPE_CHAT() {
    return Channels.TYPE_CHAT
  }

  static get STATUS_ACTIVE() {
    return 'active'
  }

  static get STATUS_DELETED() {
    return 'deleted'
  }

  id: number | null
  name: string | null
  title: string | null
  description: string | null
  enabled: boolean
  status: string
  revision: number
  category: Category
  revisions: Revision[]
  enviromnent: string | null
  timeCreated: number | null
  timeUpdated: number | null

  constructor(data: object) {
    const revision = new Revision()

    if (data) {
      revision.unserialize(data)
    }

    this.id = null
    this.name = null
    this.title = null
    this.description = null
    this.enabled = true
    this.status = Template.STATUS_ACTIVE;
    this.revision = 1
    this.category = new Category()
    this.revisions = [revision]
    this.enviromnent = null
    this.timeCreated = null
    this.timeUpdated = null    
  }

  unserialize(data: object) {
    const map = new Map(Object.entries(data))

    this.id = map.get('id') || this.id
    this.name = map.get('name') || this.name
    this.title = map.get('title') || this.title
    this.description = map.get('description') || this.description
    this.enabled = map.get('enabled') || this.enabled
    this.status = map.get('status') || this.status
    this.revision = map.get('revision') || this.revision
    this.enviromnent = map.get('enviromnent') || this.enviromnent
    this.category = new Category()
    this.category.unserialize(map.get('category') || {})
  }

  static getChannelTypes() {
    return [
      Template.CHANNEL_TYPE_EMAIL,
      Template.CHANNEL_TYPE_SMS,
      Template.CHANNEL_TYPE_PUSH,
      Template.CHANNEL_TYPE_CALLBACK,
      Template.CHANNEL_TYPE_CHAT,
    ]
  }

  static getStatuses() {
    return [
      Template.STATUS_ACTIVE,
      Template.STATUS_DELETED,
    ]
  }
}
