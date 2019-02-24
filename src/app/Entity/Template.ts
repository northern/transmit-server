
import Category from './Template/Category'
import Revision from './Template/Revision'
import Channels from './Template/Revision/Channels'

export default class Template {
  static readonly STATUS_ACTIVE: string = 'active'
  static readonly STATUS_DELETED: string = 'deleted'

  static readonly CHANNEL_TYPE_EMAIL    = Channels.TYPE_EMAIL
  static readonly CHANNEL_TYPE_SMS      = Channels.TYPE_SMS
  static readonly CHANNEL_TYPE_PUSH     = Channels.TYPE_PUSH
  static readonly CHANNEL_TYPE_CALLBACK = Channels.TYPE_CALLBACK
  static readonly CHANNEL_TYPE_CHAT     = Channels.TYPE_CHAT

  static readonly ENGINE_TWIG: string = 'twig'

  public id: number | null
  public name: string | null
  public title: string | null
  public description: string | null
  public enabled: boolean
  public status: string
  public revision: number
  public category: Category
  public revisions: Revision[]
  public enviromnent: string | null
  public engine: string
  public timeCreated: number | null
  public timeUpdated: number | null

  constructor(data: object | null = null) {
    const revision = new Revision(1)

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
    this.engine = Template.ENGINE_TWIG
    this.timeCreated = null
    this.timeUpdated = null    
  }

  static getStatuses() {
    return [
      Template.STATUS_ACTIVE,
      Template.STATUS_DELETED,
    ]
  }

  static getEngines() {
    return [
      Template.ENGINE_TWIG,
    ]
  }
}
