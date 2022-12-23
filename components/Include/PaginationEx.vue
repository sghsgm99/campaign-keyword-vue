<template>
  <div
    class="data-page pt-4 pb-3 d-flex align-items-center justify-content-end flex-wrap"
  >
    <div
      class="data-page-right col-md-2 col-6 d-flex flex-row align-items-center m-0 p-0 order-1 order-md-0"
    >
      <p class="mb-0 text-lowercase">
        <span class="text-pink">{{ paging.totalRows }}</span> creatives found
      </p>
    </div>
    <div
      class="data-page-right col-md-4 d-flex flex-row-reverse align-items-center m-0 p-0 order-0 mb-4 mb-md-0"
    >
      <b-pagination
        v-model="currentPage"
        :total-rows="paging.totalRows"
        :per-page="paging.perPage"
        aria-controls="my-table"
      ></b-pagination>
      <div class="d-flex align-items-center">
        <label for="show" class="pt-0">
          <p>show</p>
        </label>
        <b-form-select
          class="show-more form-input"
          v-model.trim="perPageLocal"
          :options="['40']"
        >
        </b-form-select>
      </div>
    </div>
    <div
      class="data-page-right col-md-6 col-6 d-flex flex-row-reverse align-items-center m-0 p-0 order-3"
    >
      <p class="mb-0 text-lowercase">
        <span class="text-pink">{{ paging.selected }}</span> creatives selected
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pagination: {
      type: Object
    }
  },
  data() {
    return {
      paging: {
        currentPage: 1,
        totalRows: 0,
        perPage: 40,
        items: 1,
        selected: 0
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
    }
  },
  mounted() {
    this.paging = this.pagination ? this.pagination : this.paging
  }
}
</script>
