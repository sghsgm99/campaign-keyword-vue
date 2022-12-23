<template>
  <div class="db-content vh-200 p-0">
    <div class="breadcrumbs p-4">
      <h1 class="m-0 p-0">{{ this.name }}</h1>
      <Breadcrumbs :links="breadcrumbs" class="mt-2" />
    </div>
    <div class="data-content data-content-tabs ps-4 pe-4 pb-4">
      <div id="db-forms">
        <b-card no-body>
          <b-tabs card pills v-model="tabIndex">
            <b-tab title="Search Creatives" active :disabled="disabled">
              <b-card-text>
                <CollectionTabSearch />
              </b-card-text>
            </b-tab>
            <b-tab title="Collections" :disabled="disabled">
              <b-card-text>
                <CollectionTabGroup />
              </b-card-text>
            </b-tab>
            <b-tab title="Publish Ads" :disabled="disabled">
              <b-card-text>
                <CollectionTabAdList />
              </b-card-text>
            </b-tab>
            <b-tab v-if="isPublishAnAD">
              <template #title>
                {{ adTabName
                }}<i
                  class="far fa-times-circle close-tab-btn"
                  @click="closeTab()"
                ></i>
              </template>
              <b-card-text>
                <CollectionTabAds
                  v-model="activeAdName"
                  :adItems="adItems"
                  :adId="adId"
                  :adType="adType"
                />
              </b-card-text>
            </b-tab>
          </b-tabs>
        </b-card>
      </div>
    </div>
  </div>
</template>

<script>
import Collections from '~/models/Collections'

export default {
  layout: 'Main',
  data() {
    return {
      tabIndex: 0,
      name: '',
      adId: null,
      adType: null,
      isPublishAnAD: false,
      disabled: false,
      flag: false,
      breadcrumbs: [
        {
          name: 'Campaign Collections',
          to: '/collections'
        }
      ],
      activeAdName: ''
    }
  },
  created() {
    this.$nuxt.$on('emit-show-tab', (payload) => {
      if (payload['message'] == 'success') {
        this.adId = payload['adId']
        this.adType = payload['adType']
        this.isPublishAnAD = true
        this.flag = true
      }
    })

    this.$nuxt.$on('emit-close-tab', (payload) => {
      if (payload['message'] == 'success') {
        this.closeTab()
      }
    })
  },
  updated() {
    if (this.flag && this.isPublishAnAD) {
      this.tabIndex = 3
      this.disabled = true
      this.flag = false
    }
  },
  computed: {
    adTabName() {
      return this.activeAdName == '' ? 'Publish An Ad' : this.activeAdName
    }
  },
  async fetch() {
    if (this.$route.params.id && this.$route.name.indexOf('edit') != -1) {
      const id = this.$route.params.id

      Collections.fetch(id).then(async (res) => {
        this.name = res.response.data.data.name
        this.adItems = res.response.data.data
        this.breadcrumbs = [...this.breadcrumbs, { name: 'Edit: ' + this.name }]
      })
    }
  },
  methods: {
    closeTab() {
      this.isPublishAnAD = false
      this.disabled = false
      $nuxt.$emit('emit-refresh-table', { message: 'success' })
      this.activeAdName = ''
    }
  }
}
</script>

<style lang="scss" scoped>
.close-tab-btn {
  position: absolute;
  right: 0px;
  top: 0;
  color: #7b7b7b;
  padding: 5px;

  .darktheme & {
    color: #aab8c6;
  }
}
</style>
