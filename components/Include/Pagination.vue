<template>
  <div
    class="data-page px-2 pb-4 d-flex align-items-center justify-content-end flex-wrap"
  >
    <div
      class="data-page-left col-md-6 d-flex flex-row align-items-center m-0 p-0"
    >
      <p class="mb-0">
        SHOWING {{ totalShowedItems }} / {{ paging.totalRows }}
      </p>
    </div>
    <div
      class="data-page-right col-md-6 d-flex flex-row-reverse flex-md-nowrap flex-wrap align-items-center m-0 p-0"
    >
      <!-- <ul class="pagination m-0">
              <li><a class="previous page-numbers" href="#">&laquo;</a></li>
              <li><a class="page-numbers" href="#">&lsaquo;</a></li>
              <li><span aria-current="page" class="page-numbers current">1</span></li>
              <li><a class="page-numbers" href="#">&rsaquo;</a></li>
              <li><a class="next page-numbers" href="#">&raquo;</a></li>
          </ul> -->
      <b-pagination
        v-model="currentPage"
        :total-rows="paging.totalRows"
        :per-page="paging.perPage"
        aria-controls="my-table"
        class="mt-2 mt-sm-0"
      ></b-pagination>
      <div class="d-flex align-items-center mt-2 mt-sm-0">
        <label for="show" class="pt-0">
          <p>show</p>
        </label>
        <b-form-select
          class="show-more form-input"
          v-model.trim="perPageLocal"
          :options="options"
        >
        </b-form-select>
      </div>
      <!-- <select name="" class="show-more" v-model="perPageLocal">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
          </select>
          <p>Show</p> -->
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
