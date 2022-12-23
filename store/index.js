import Vuex from 'vuex'
import VuexORM from '@vuex-orm/core'
import database from '@/database'
import VuexORMAxios from '@vuex-orm/plugin-axios'
import VuexPersistence from 'vuex-persist'
import { getField, updateField } from 'vuex-map-fields'

VuexORM.use(VuexORMAxios)

export const plugins = [
  VuexORM.install(database),
  new VuexPersistence({
    storage: window.localStorage,
    reducer: (state) => ({
      entities: {
        campaigns: state.entities.campaigns
      }
    }),
    filter: (mutation) => {
      return (
        (mutation.type == 'entities/insertRecords' ||
          mutation.type == 'entities/insert') &&
        mutation.payload.entity == 'campaigns'
      )
    }
  }).plugin
]

export const state = () => ({
  isDarkActive: false,
  searchOptions: {
    keyword: '',
    article_type: '',
    article_status: '',
    article_owner: '',
    site_platform: '',
    site_status: '',
    site_owner: '',
    channel_platform: '',
    channel_status: '',
    channel_owner: '',
    campaign_channel: '',
    campaign_status: '',
    campaign_owner: '',
    fb_channel_id: '',
    fb_campaign_objective: '',
    fb_status: '',
    fb_owner: ''
  },
  searchedKeyword: ''
})

export const getters = {
  getField,
  getDarkStats: (state) => state.isDarkActive,
  getSearchedKeyword: (state) => state.searchedKeyword
}

export const actions = {
  toggleDarkTheme({ commit }, isDark) {
    commit('setDarkMode', isDark)
  }
}

export const mutations = {
  updateField,
  setDarkMode(state, isDark) {
    state.isDarkActive = isDark
  },
  setSearchedKeyword(state, keyword) {
    state.searchedKeyword = keyword
  }
}
