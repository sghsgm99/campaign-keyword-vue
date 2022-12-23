<template>
  <div>
    <b-alert v-model="showToast" dismissible fade v-if="toast.message">
      <div class="d-flex justify-content-between">
        <span>{{ toast.message }}</span>
      </div>
    </b-alert>

    <div
      class="search-big search-big-adjust pb-4 d-flex align-items-center justify-center"
    >
      <i class="fa fa-search"></i>
      <input
        type="text"
        class="block w-100"
        placeholder="Search.."
        @keyup.prevent="refreshTable"
        v-model="keyword"
      />
    </div>

    <div class="data-content pb-4">
      <div class="table-responsive">
        <b-table
          bordered
          striped
          :fields="collectionsFields"
          :items="collections"
          selectMode="single"
          selectable
          :busy="isBusy"
          class="l1"
          show-empty
          empty-text="There are no campaign collections to show."
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
              @click.prevent="showDuplicateModal(data.item.id)"
              ><i class="fas fa-copy"></i
            ></a>
            <nuxt-link
              v-b-tooltip.hover
              title="Edit"
              class="mx-2"
              :to="`/collections/edit/${data.item.id}`"
              v-if="checkPermission(2)"
              ><i class="fas fa-pencil-alt"></i
            ></nuxt-link>
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

    <b-modal
      ref="duplicate-modal"
      size="md"
      hide-footer
      centered
      title="Duplicate Campaign Collection"
      header-bg-variant="headerlight"
      :dialog-class="{ darktheme: darkMode }"
    >
      <div class="create-campaign-btns my-1">
        <div>
          <button
            class="article-radio-selector btn-plain"
            @click="doDuplicate(false)"
          >
            <label class="py-3 px-2 ads">Duplicate Collection only</label>
          </button>
        </div>
        <div>
          <button
            class="article-radio-selector btn-plain"
            @click="doDuplicate(true)"
          >
            <label class="py-3 px-2 ads"
              >Duplicate Collection including groups and ads</label
            >
          </button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Collections from '~/models/Collections'
import operationPermissions from '~/mixins/operationPermissions'
import enums from '~/mixins/enums'
import editRow from '~/mixins/editRow'

export default {
  layout: 'UserTab',
  data() {
    return {
      pageName: 'Domain',
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
      collectionsFields: [
        {
          label: 'COLLECTION NAME',
          key: 'name',
          sortable: true
        },
        {
          label: 'GROUP',
          key: 'groups'
        },
        {
          label: 'OWNER/USER',
          key: 'author_name'
        },
        {
          label: 'Publish Ads',
          key: 'status'
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
      collections: [],
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
      showToast: false,
      activeDuplicateId: null
    }
  },
  mixins: [enums, operationPermissions, editRow],
  async fetch() {
    this.refreshTable()
  },
  mounted() {
    this.$root.$on('bv::modal::hidden', (_, modalId) => {
      this.activeDuplicateId = null
    })
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
            Collections.inactive(id)
              .then(async (res) => {
                Collections.delete(id)
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

    async doDuplicate(deep) {
      this.isBusy = true
      await Collections.duplicate(this.activeDuplicateId, deep)
        .then((res) => {
          this.$refs['duplicate-modal'].hide()
          this.showToast = true
          this.toast.message = res.response.data.message
          this.isBusy = false
          this.refreshTable()
          this.activeDuplicateId = null
        })
        .catch((err) => {
          this.isBusy = false
        })
    },

    showDuplicateModal(id) {
      this.$refs['duplicate-modal'].show()
      this.activeDuplicateId = id
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
      this.isBusy = true
      await Collections.setPerPage(this.pagination.perPage)
        .setSearch(this.keyword)
        .setPage(this.pagination.currentPage)
        .setSortField(this.sortField)
        .setSortOrder(this.sortOrder)
        .collection()
        .then((res) => {
          this.collections = res.response.data.data
          Collections.insert({ data: this.collections })
          this.setPagination(res.response.data)
          this.isBusy = false
        })
        .catch((err) => {
          this.isBusy = false
        })
    }
  },
  computed: {
    darkMode() {
      return this.$store.state.isDarkActive
    }
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
