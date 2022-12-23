<template>
  <div>
    <div class="mb-3">
      <div class="row">
        <div class="col-sm-3">
          <b-input-group
            prepend="Keyword"
            class="input-group-btn campaign-tag-input"
          >
            <b-form-input
              v-model="keyword"
              placeholder="Search keywords"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-sm-3">
          <b-input-group
            prepend="Value"
            append="$"
            class="input-group-btn campaign-tag-input"
          >
            <b-form-input
              v-model="lvalue"
              placeholder="Top of page bid (low range)"
            ></b-form-input>
          </b-input-group>
        </div>
        <div class="col-sm-6 mt-1">
          <button class="btn btn-primary" @click.prevent="fetchResults">
            Search <b-spinner small label="Spinning" v-if="isBusy"></b-spinner>
          </button>
          <button class="btn btn-info" @click.prevent="csvExport(csvData)">
            csv
          </button>
        </div>
      </div>
    </div>
    <div class="data-content pb-4">
      <div class="table-responsive">
        <b-table
          bordered
          striped
          thead-class="table1-thead"
          :items="keyres"
          :fields="fields"
          selectMode="single"
          selectable
          :busy="isBusy"
          class="l1"
          show-empty
          empty-text="There are no data to show."
          responsive
        >
          <template #table-busy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading</strong>
            </div>
          </template>
          <template v-slot:cell(compet)="data">
            <b-badge pill variant="success">{{ data.value }}</b-badge>
          </template>
          <template v-slot:cell(action)="data">
            <b-link
              href="#"
              @click.prevent="putKeyword(1, data.value)"
              class="unpublished"
              >E</b-link
            >
            <b-link
              href="#"
              @click.prevent="putKeyword(2, data.value)"
              class="unpublished"
              >P</b-link
            >
            <b-link
              href="#"
              @click.prevent="putKeyword(3, data.value)"
              class="unpublished"
              >B</b-link
            >
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
import AdTemplates from '~/models/AdTemplates'

export default {
  components: {},
  async mounted() {},
  data() {
    return {
      params: '',
      keyword: null,
      lvalue: 6,
      keyres: null,
      isBusy: false,
      error: { message: null },
      pagination: {
        currentPage: 1,
        totalRows: 0,
        perPage: 10,
        items: 1
      },
      fields: [
        {
          label: 'KEYWORD',
          key: 'keyword'
        },
        {
          label: 'AVG. MONTHLY SEARCHES',
          key: 'avgmonth'
        },
        {
          label: 'TOP OF PAGE BID (LOW RANGE)',
          key: 'lowrange',
          sortable: true
        },
        {
          label: 'TOP OF PAGE BID (HIGH RANGE)',
          key: 'highrange'
        },
        {
          label: 'COMPETITION',
          key: 'compet'
        },
        {
          label: 'SEMRUSH CPC',
          key: 'sem_cpc'
        },
        {
          label: 'Action',
          key: 'action',
          variant: 'actions'
        }
      ]
    }
  },
  computed: {
    csvData() {
      if (!this.keyres) return
      return this.keyres.map((item) => ({
        keyword: item.keyword,
        'Avg. monthly searches': item.avgmonth,
        'Top of page bid (low range)': item.lowrange,
        'Top of page bid (high range)': item.highrange,
        Competition: item.compet
      }))
    }
  },
  methods: {
    async csvExport(arrData) {
      if (!arrData) return

      let csvContent = 'data:text/csv;charset=utf-8,'
      csvContent += [
        Object.keys(arrData[0]).join(','),
        ...arrData.map((item) => Object.values(item).join(','))
      ]
        .join('\n')
        .replace(/(^\[)|(\]$)/gm, '')

      const data = encodeURI(csvContent)
      const link = document.createElement('a')
      link.setAttribute('href', data)
      link.setAttribute('download', 'keywords.csv')
      link.click()
    },
    async fetchResults() {
      if (this.keyword == null) {
        this.error.message = 'Keyword is required.'
        return
      }

      if (this.lvalue == 0) {
        this.error.message = 'Value is required.'
        return
      }

      this.isBusy = !this.isBusy
      await AdTemplates.setKeyword(this.keyword)
        .setLowValue(this.lvalue)
        .getKeywordLow()
        .then((res) => {
          this.keyres = res.response.data.data
          this.setPagination(res.response.data)
          this.isBusy = !this.isBusy
        })
    },

    setPagination(data) {
      this.pagination.currentPage = data.meta.current_page
      this.pagination.totalRows = data.meta.total
      this.pagination.perPage = data.meta.per_page
      this.pagination.items = data.data.length
    },

    async doUpdatePagination(data) {
      this.pagination = data
      this.refreshTable()
    },

    async refreshTable() {
      this.isBusy = !this.isBusy
      await AdTemplates.setPerPage(this.pagination.perPage)
        .setKeyword(this.keyword)
        .setLowValue(this.lvalue)
        .setPage(this.pagination.currentPage)
        .collection()
        .then((res) => {
          this.keyres = res.response.data.data
          this.setPagination(res.response.data)
          this.isBusy = !this.isBusy
        })
    },

    async putKeyword(f, v) {
      this.$emit('onPutKeyword', f, v)
    }
  }
}
</script>
