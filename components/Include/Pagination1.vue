<template>
  <div
    class="data-page px-2 pb-4 d-flex align-items-center justify-content-end flex-wrap"
  >
    <div
      class="data-page-right col-md-6 d-flex flex-row-reverse flex-md-nowrap flex-wrap align-items-center m-0 p-0"
    >
      <b-pagination
        v-model="currentPage"
        :total-rows="paging.totalRows"
        :per-page="paging.perPage"
        aria-controls="my-table"
        class="mt-2 mt-sm-0"
      ></b-pagination>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    pagination: {
      type: Object
    },
    options: {
      type: Array,
      default: () => ['10', '15', '25', '50']
    }
  },
  data() {
    return {
      paging: {
        currentPage: 1,
        totalRows: 0,
        perPage: 15,
        items: 1
      }
    }
  },
  computed: {
    perPageLocal: {
      get: function () {
        return this.pagination.perPage
          ? this.pagination.perPage
          : this.paging.perPage
      },
      set: function (value) {
        const oldVal = this.paging.perPage
        this.paging.perPage = value

        if (oldVal !== this.paging.perPage) {
          this.$emit('doUpdatePagination', this.paging)
        }
      }
    },
    currentPage: {
      get: function () {
        return this.pagination.currentPage
          ? this.pagination.currentPage
          : this.paging.currentPage
      },
      set: function (value) {
        const currentPage = this.paging.currentPage
        this.paging.currentPage = value

        if (currentPage !== this.paging.currentPage) {
          this.$emit('doUpdatePagination', this.paging)
        }
      }
    },
    totalShowedItems() {
      return (
        this.paging.items + (this.paging.currentPage - 1) * this.paging.perPage
      )
    }
  },
  mounted() {
    this.paging = this.pagination ? this.pagination : this.paging
  }
}
</script>
