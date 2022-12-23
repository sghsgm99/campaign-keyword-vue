import { Model } from '@vuex-orm/core'

export default class Collections extends Model {
  static entity = 'collections'

  static primaryKey = 'id'

  static perPage = 25

  static page = 1

  static type = null

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

  static setType(type) {
    this.type = type
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

  static collection() {
    this.queryParams =
      `?page=${this.page}&per_page=${this.perPage}` +
      (this.search ? `&search=${this.search}` : '') +
      (this.sortField ? `&sort=${this.sortField}` : '') +
      (this.sortOrder ? `&sort_type=${this.sortOrder}` : '')
    return this.api().get(`${this.entity}${this.queryParams}`)
  }

  static post(payload) {
    return this.api().post(`${this.entity}`, payload)
  }

  static fetch(id) {
    return this.api().get(`${this.entity}/${id}`)
  }

  static inactive(id) {
    return this.api().delete(`${this.entity}/${id}`)
  }

  static duplicate(id, deep = false) {
    this.queryParams = deep ? `?deep=true` : ''
    return this.api().get(`${this.entity}/${id}/duplicate${this.queryParams}`)
  }

  static searchCreative(payload) {
    this.queryParams = `?page=${this.page}&per_page=${this.perPage}`
    return this.api().post(`${this.entity}/search${this.queryParams}`, payload)
  }

  static postGroup(payload) {
    return this.api().post(`${this.entity}/group`, payload)
  }

  static postGroupCreative(gid, payload) {
    return this.api().post(`${this.entity}/group/${gid}/creative`, payload)
  }

  static getGroups(id) {
    return this.api().get(`${this.entity}/group/${id}`)
  }

  static getCreatives(group_id) {
    this.queryParams =
      `?page=${this.page}&per_page=${this.perPage}` +
      (this.type ? `&type=${this.type}` : '')

    if (group_id == 0)
      return this.api().get(`${this.entity}/creatives/all${this.queryParams}`)

    return this.api().get(
      `${this.entity}/creatives/${group_id}${this.queryParams}`
    )
  }

  static addCreative(payload) {
    return this.api().post(`${this.entity}/creative`, payload)
  }

  static removeCreative(payload) {
    return this.api().delete(`${this.entity}/creative/delete`, {
      data: payload
    })
  }

  static deleteGroup(groupId) {
    return this.api().delete(`${this.entity}/group/${groupId}`)
  }

  static duplicateGroup(groupId) {
    return this.api().get(`collections-group/${groupId}/duplicate`)
  }

  static deleteCreativeFromGroup(groupId, payload) {
    return this.api().delete(
      `${this.entity}/group/${groupId}/delete-creatives`,
      { data: payload }
    )
  }

  static uploadCreative(group_id, payload) {
    if (group_id == 0) {
      return this.api().post(`${this.entity}/creative-upload/all`, payload, {
        headers: {
          'Content-Type': `multipart/form-data;boundary=${payload._boundary}`
        }
      })
    }

    return this.api().post(
      `${this.entity}/creative-upload/${group_id}`,
      payload,
      {
        headers: {
          'Content-Type': `multipart/form-data;boundary=${payload._boundary}`
        }
      }
    )
  }

  static fetchAdAccounts() {
    this.queryParams = `?search=${this.search}`

    return this.api().get(
      `channels/facebook/get/ad-accounts${this.queryParams}`
    )
  }

  static fetchAdSets() {
    this.queryParams = `?search=${this.search}`

    return this.api().get(
      `channels/facebook/get/ad-accounts${this.queryParams}`
    )
  }

  static put(id, payload) {
    return this.api().put(`/${this.entity}/${id}`, payload)
  }
}
