import { Model } from '@vuex-orm/core'

export default class AdTemplates extends Model {
  static entity = 'adtemplates'

  static primaryKey = 'id'

  static perPage = 10

  static page = 1

  static keyword = null

  static lvalue = null

  static queryParams = null

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

  static setKeyword(keyword) {
    this.keyword = keyword
    return this
  }

  static setLowValue(lvalue) {
    this.lvalue = lvalue
    return this
  }

  static getKeywordHigh() {
    this.queryParams = `?keyword=${this.keyword}&lvalue=${this.lvalue}`
    return this.api().get(`${this.entity}/keyword-high${this.queryParams}`)
  }

  static getCampaignName() {
    this.queryParams = `?keyword=${this.keyword}&lvalue=${this.lvalue}`
    return this.api().get(
      `${this.entity}/get-campaign-names${this.queryParams}`
    )
  }

  static getKeywordLow() {
    this.queryParams = `?page=${this.page}&per_page=${this.perPage}&keyword=${this.keyword}&lvalue=${this.lvalue}`
    return this.api().get(`${this.entity}/keyword-low${this.queryParams}`)
  }

  static submitCampaigns(formData) {
    return this.api().post(`${this.entity}/submit-campaigns`, formData)
  }
}
