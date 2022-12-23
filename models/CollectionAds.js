import { Model } from '@vuex-orm/core'

export default class CollectionAds extends Model {
  static entity = 'collection-ads'

  static primaryKey = 'id'

  static perPage = 25

  static page = 1

  static search = null

  static queryParams = null

  static sortField = null

  static sortOrder = null

  static fields() {
    return {
      id: this.attr(''),
      name: this.attr(''),
      status: this.attr(''),
      status_label: this.attr(''),
      account_id: this.attr(''),
      user_id: this.attr(''),
      user: this.attr('')
    }
  }

  static setPerPage(perPage) {
    if (perPage) {
      this.perPage = perPage
    } else {
      this.perPage = 25
    }
    return this
  }

  static setPage(page) {
    this.page = page
    return this
  }

  static setSearch(search) {
    this.search = search
    return this
  }

  static setSortField(field) {
    this.sortField = field
    return this
  }

  static setSortOrder(order) {
    this.sortOrder = order
    return this
  }

  static collection(cid) {
    this.queryParams =
      `?page=${this.page}&per_page=${this.perPage}` +
      (this.search ? `&search=${this.search}` : '') +
      (this.sortField ? `&sort=${this.sortField}` : '') +
      (this.sortOrder ? `&sort_type=${this.sortOrder}` : '')
    return this.api().get(`collections/${cid}/ads${this.queryParams}`)
  }

  static post(payload) {
    return this.api().post(`${this.entity}`, payload)
  }

  static put(id, payload) {
    return this.api().put(`/${this.entity}/${id}`, payload)
  }

  static fetch(id) {
    return this.api().get(`${this.entity}/${id}`)
  }

  static inactive(id) {
    return this.api().delete(`${this.entity}/${id}`)
  }

  static duplicate(id) {
    return this.api().get(`${this.entity}/${id}/duplicate`)
  }

  static getChannels() {
    return this.api().get(`${this.entity}/channel/all`)
  }

  static getAdAccounts(channel_id) {
    return this.api().get(`channels/${channel_id}/facebook/get/ad-accounts`)
  }

  static getCampaigns(ad_account_id) {
    this.queryParams = `?ad_account_id=` + ad_account_id + `&status=2`
    return this.api().get(`facebook-campaigns${this.queryParams}`)
  }

  static getAdSets(campaign_id) {
    this.queryParams = `?campaign=` + campaign_id + `&status=2`
    return this.api().get(`facebook-adsets${this.queryParams}`)
  }

  static preview(payload) {
    return this.api().post(`${this.entity}/preview`, payload)
  }
}
