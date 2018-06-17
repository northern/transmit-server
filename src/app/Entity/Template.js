
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

  constructor(data) {
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
    this.timeCreated = null
    this.timeUpdated = null    
  }

  unserialize(data) {
    this.id = data.id || this.id
    this.name = data.name || this.name
    this.title = data.title || this.title
    this.description = data.description || this.description
    this.enabled = data.enabled || this.enabled
    this.status = data.status || this.status
    this.revision = data.revision || this.revision
    this.category = new Category().unserialize(data.category || {})

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
