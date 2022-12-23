<template>
  <div class="db-content vh-200 p-0">
    <div class="breadcrumbs p-4">
      <h1 class="m-0 p-0">{{ pageName }}</h1>
    </div>
    <!--fixed when scroll-->
    <div class="data-head p-4 d-flex align-items-center">
      <div class="data-head-left col-md-9 d-flex align-items-center m-0">
        <div class="data-head-left d-flex flex-row align-items-center m-0 p-0">
          <div class="row">
            <div class="cols-12 col-md-8">
              <div class="d-flex">
                <div class="mr-3">
                  <input
                    type="text"
                    placeholder="Search Keyword"
                    class="form-input"
                    v-model="keyword"
                  />
                </div>
                <div class="mr-3">
                  <b-input-group size="md" prepend="$">
                    <b-form-input
                      name=""
                      id=""
                      v-model="lvalue"
                      class="p-2 form-input"
                      placeholder="Top of page bid (low range)"
                    ></b-form-input>
                  </b-input-group>
                </div>
                <button
                  class="btn search text-center mr-2 primary-outline-btn"
                  @click.prevent="fetchResults"
                >
                  SEARCH
                  <b-spinner small label="Spinning" v-if="isBusy"></b-spinner>
                </button>
              </div>
            </div>
            <div class="cols-12 col-md-4 mt-3 mt-md-0">
              <nuxt-link :to="`${slug}/create`" class="btn primary-btn"
                >Create Campaign</nuxt-link
              >
            </div>
          </div>
        </div>
      </div>
      <div
        class="data-head-right cols-12 col-md-3 d-flex flex-row justify-content-end m-0 p-0"
      >
        <small>
          <button
            class="btn text-center mr-2"
            @click.prevent="csvExport(csvData)"
          >
            Download CSV
            <i class="fas fa-download"></i>
          </button>
        </small>
      </div>
    </div>
    <!--end-->
    <div class="data-content px-4 pb-4">
      <div class="table-responsive">
        <b-table
          bordered
          :fields="fields"
          :current-page="currentPage"
          :per-page="perPage"
          :items="keyres"
          selectMode="single"
          :busy="isBusy"
          class="l1"
          show-empty
          empty-text="There are no keywords to show."
        >
          <template #table-busy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle"></b-spinner>
              <strong>Loading</strong>
            </div>
          </template>
          <template #cell(compet)="data">
            <span class="published">{{ data.value }}</span>
          </template>
        </b-table>
      </div>
    </div>

    <div
      class="data-page px-4 pb-4 d-flex align-items-center justify-content-end"
    >
      <div
        class="data-page-left col-md-6 d-flex flex-row align-items-center m-0 p-0"
      >
        <p class="mb-0">SHOWING {{ totalRows }} ENTRIES</p>
      </div>
      <div
        class="data-page-right col-md-6 d-flex flex-row-reverse align-items-center m-0 p-0"
      >
        <b-pagination
          v-model="currentPage"
          :total-rows="totalRows"
          :per-page="perPage"
          aria-controls="my-table"
        ></b-pagination>
        <div class="d-flex align-items-center">
          <label for="show" class="pt-0">
            <p>show</p>
          </label>
          <b-form-select
            class="show-more form-input"
            v-model.trim="perPage"
            :options="['10', '25', '50']"
          >
          </b-form-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AdTemplates from '~/models/AdTemplates'
export default {
  layout: 'Main',
  data() {
    return {
      pageName: 'Keyword Planner',
      slug: 'adtemplates',
      isBusy: false,
      keyword: '',
      lvalue: 5,
      keyres: [],
      currentPage: 1,
      totalRows: 0,
      perPage: 10,
      fields: [
        {
          label: 'KEYWORD',
          key: 'keyword'
        },
        {
          label: 'AVG. MONTHLY SEARCHES',
          key: 'avgmonth',
          formatter: (value) => {
            if (value != null) return value.toLocaleString()
          }
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
    async fetchResults() {
      if (this.keyword == '') {
        return
      }

      this.isBusy = !this.isBusy
      await AdTemplates.setKeyword(this.keyword)
        .setLowValue(this.lvalue)
        .getKeywordHigh()
        .then((res) => {
          this.keyres = res.response.data.data
          this.totalRows = res.response.data.meta.total
          this.isBusy = !this.isBusy
        })
    },

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
    }
  }
}
</script>

<style scoped>
section#dashboard .data-head .data-head-left button.search {
  background-color: transparent !important;
  border: solid 1px #ff2770;
  color: #ff2770 !important;
}
section#dashboard .data-head .data-head-left a.create {
  padding: 0.375rem 0.75rem;
  font-size: 1rem;
  font-weight: 400;
}
</style>
