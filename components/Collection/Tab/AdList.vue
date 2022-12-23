<template>
  <div>
    <b-alert v-model="showToast" dismissible fade v-if="toast.message">
      <div class="d-flex justify-content-between">
        <span>{{ toast.message }}</span>
      </div>
    </b-alert>

    <div class="pb-4 d-flex justify-content-between">
      <div class="search search-big align-items-center">
        <i class="fa fa-search search-big search-big-adjust"></i>
        <input
          type="text"
          class="block w-100"
          placeholder="Search.."
          @keyup.prevent="refreshData"
          v-model="keyword"
        />
      </div>
      <div class="align-items-center">
        <div
          class="data-head-right d-flex flex-row justify-content-end align-items-center data-head-date"
        >
          <input
            type="button"
            class="btn btn-primary primary-btn"
            value="Publish An Ad"
            @click="showPublishAnAD(null)"
          />
        </div>
      </div>
    </div>

    <div class="data-content pb-4">
      <div class="table-responsive">
        <b-table
          bordered
          striped
          :fields="collectionAdsFields"
          :items="collectionAds"
          selectMode="single"
          selectable
          :busy="isBusy"
          class="l1"
          show-empty
          empty-text="There are no collection ads to show."
          responsive
          @sort-changed="sortingChanged"
          :no-local-sorting="true"
        >
          <template #table-busy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading</strong>
            </div>
          </template>
          <template #cell(status_label)="data">
            <span :class="data.item.status_label.toLowerCase()">{{
              data.item.status_label
            }}</span>
          </template>
          <template #cell(user)="data">
            <span v-if="data.item.user && data.item.user.full_name">
              {{ data.item.user.full_name }}
            </span>
            <span v-else>
              {{ data.item.user }}
            </span>
          </template>
          <template #cell(groups)="data">
            <div v-if="data.item.groups == []"></div>
            <div v-else>
              <div
                v-if="
                  data.item.groups.length > 0 && data.item.groups.length > 2
                "
              >
                <a
                  v-for="(d, index) in data.item.groups.slice(0, 2)"
                  :key="index"
                  target="_blank"
                >
                  <span class="site-link">{{ d['name'] }}</span
                  ><span v-if="index < data.item.groups.length - 2">, </span>
                </a>
                <b-badge variant="secondary" class="site-badge mx-1">
                  +{{ data.item.groups.length - 2 }}
                </b-badge>
              </div>
              <div
                v-if="
                  data.item.groups.length > 0 && data.item.groups.length < 3
                "
              >
                <a
                  v-for="(d, index) in data.item.groups"
                  :key="index"
                  target="_blank"
                  ><span class="site-link">{{ d['name'] }}</span
                  ><span v-if="index < data.item.groups.length - 1">, </span>
                </a>
              </div>
            </div>
          </template>
          <template #cell(updated_at)="data">
            <span>
              {{ data.item.updated_at | formatDate1 }}
            </span>
          </template>
          <template #cell(id)="data">
            <a
              v-b-tooltip.hover
              title="Duplicate"
              class="mx-2"
              @click.prevent="doDuplicate(data.item.id)"
              ><i class="fas fa-copy"></i
            ></a>
            <a
              v-b-tooltip.hover
              title="Edit"
              class="mx-2"
              @click.prevent="showPublishAnAD(data.item.id)"
              v-if="checkPermission(2)"
              ><i class="fas fa-pencil-alt"></i
            ></a>
            <a
              v-b-tooltip.hover
              title="Delete"
              class="mx-2"
              @click.prevent="doDelete(data.item.id)"
              ><i class="far fa-trash-alt"></i
            ></a>
          </template>
        </b-table>
      </div>
    </div>
    <IncludePagination
      :params="params"
      ref="operations"
      :pagination="pagination"
      @doUpdatePagination="doUpdatePagination"
    />
  </div>
</template>

<script>
import CollectionAds from '~/models/CollectionAds'
import operationPermissions from '~/mixins/operationPermissions'
import enums from '~/mixins/enums'
import editRow from '~/mixins/editRow'

export default {
  layout: 'UserTab',
  data() {
    return {
      slug: 'collections',
      isBusy: false,
      keyword: '',
      params: '',
      pagination: {
        currentPage: 1,
        totalRows: 0,
        perPage: 0,
        items: 1
      },
      collectionAdsFields: [
        {
          label: 'Collection Group',
          key: 'group_name',
          sortable: true
        },
        {
          label: 'Ad Account',
          key: 'ad_account_id'
        },
        {
          label: 'Owner/User',
          key: 'user'
        },
        {
          label: 'Status',
          key: 'status_label'
        },
        {
          label: 'MODIFIED',
          key: 'updated_at'
        },
        {
          label: 'ACTIONS',
          key: 'id'
        }
      ],
      collectionAds: [],
      defaultDebounceTimeout: 500,
      debounceTimeout: null,
      selectedRow: [],
      sortOrder: null,
      sortField: null,
      modalShow: false,
      selDomain: null,
      toast: {
        message: null
      },
      showToast: false
    }
  },
  mixins: [enums, operationPermissions, editRow],
  async fetch() {
    this.refreshTable()
  },
  methods: {
    async doDelete(id) {
      await this.$fire({
        title: 'Are you sure?',
        text: 'Do you really want to delete this item?',
        type: 'question',
        showCancelButton: true,
        customClass: {
          container: this.darkMode ? 'darktheme' : ''
        }
      })
        .then((result) => {
          if (result.value) {
            this.isBusy = true
            CollectionAds.inactive(id)
              .then(async (res) => {
                CollectionAds.delete(id)
                this.showToast = true
                this.toast.message = res.response.data.message
                this.isBusy = false
                this.refreshTable()
              })
              .catch((err) => {
                this.isBusy = false
              })
          }
        })
        .catch((err) => {})
    },

    async doDuplicate(id) {
      this.isBusy = true
      await CollectionAds.duplicate(id)
        .then((res) => {
          this.showPublishAnAD(res.response.data.data.id)
          this.showToast = true
          this.toast.message = res.response.data.message
          this.isBusy = false
          this.refreshTable()
        })
        .catch((err) => {
          this.isBusy = false
        })
    },

    setPagination(data) {
      this.pagination.currentPage = data.meta.current_page
      this.pagination.totalRows = data.meta.total
      this.pagination.perPage = data.meta.per_page
      this.pagination.items = data.data.length
    },

    sortingChanged(ctx) {
      this.sortField = ctx.sortBy
      this.sortOrder = ctx.sortDesc ? 'DESC' : 'ASC'
      this.refreshTable()
    },

    async doUpdatePagination(data) {
      this.pagination = data
      this.refreshTable()
    },

    async refreshTable() {
      if (this.$route.params.id && this.$route.name.indexOf('edit') != -1) {
        const cid = this.$route.params.id

        this.isBusy = true
        await CollectionAds.setPerPage(this.pagination.perPage)
          .setSearch(this.keyword)
          .setPage(this.pagination.currentPage)
          .setSortField(this.sortField)
          .setSortOrder(this.sortOrder)
          .collection(cid)
          .then((res) => {
            this.collectionAds = res.response.data.data
            CollectionAds.insert({ data: this.collectionAds })
            this.setPagination(res.response.data)
            this.isBusy = false
          })
          .catch((err) => {
            this.isBusy = false
          })
      }
    },

    showPublishAnAD(id) {
      $nuxt.$emit('emit-show-tab', { message: 'success', adId: id })
    }
  },
  computed: {
    darkMode() {
      return this.$store.state.isDarkActive
    }
  },
  created() {
    this.$nuxt.$on('emit-refresh-table', (payload) => {
      if (payload['message'] == 'success') {
        this.refreshTable()
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.search-big {
  @media (min-width: 768px) {
    width: 33%;
  }
}
</style>
