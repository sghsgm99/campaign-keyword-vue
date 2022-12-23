<template>
  <div class="data-content pb-2">
    <div class="table-responsive">
      <b-table
        bordered
        striped
        :fields="fields"
        :items="items"
        selectMode="multi"
        selectable
        ref="creativesTable"
        :busy="busy"
        show-empty
        empty-text="There are no creatives to show."
        responsive
        @row-selected="handleRowSelected"
      >
        <template #table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading</strong>
          </div>
        </template>

        <template #head(image)="data">
          <div>
            <b-form-checkbox
              :id="checkboxId"
              v-model="selectAll"
              @change="selectAllRows"
              class="d-inline"
              style="top: -4px"
            >
            </b-form-checkbox>
            <label :for="checkboxId" class="pt-0">{{ data.label }}</label>
          </div>
        </template>

        <template #cell(image)="data">
          <div class="d-flex">
            <b-form-checkbox
              :checked="data.rowSelected"
              @change="selectRow(data.index, data.rowSelected)"
            ></b-form-checkbox>
            <div class="creative-img">
              <img
                :src="data.item.image"
                :alt="data.item.image ? data.item.headline : null"
              />
            </div>
          </div>
        </template>

        <template #cell(type)="data">
          {{ data.item.type == 1 ? 'Search' : 'Uploads' }}
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: []
    },
    busy: {
      type: Boolean,
      default: false
    },
    selectedItems: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    fields() {
      return [
        {
          label: 'Images',
          key: 'image'
        },
        {
          label: 'From',
          key: 'type'
        },
        {
          label: 'Headline',
          key: 'headline'
        },
        {
          label: 'Description',
          key: 'description'
        },
        {
          label: 'Call To Action',
          key: 'cta'
        }
      ]
    },

    checkboxId() {
      return (
        'select-all-' +
        Math.random()
          .toString(16)
          .substring(2, 2 + 4)
      )
    }
  },
  data() {
    return {
      selectAll: false
    }
  },
  mounted() {
    this.selectedItems.forEach((el) => {
      this.$refs.creativesTable.selectRow(el.index)
    })
  },
  methods: {
    handleRowSelected(selected) {
      this.$emit('row-selected', selected)
      this.items.length == selected.length
        ? (this.selectAll = true)
        : (this.selectAll = false)
    },

    selectAllRows(checked) {
      checked
        ? this.$refs.creativesTable.selectAllRows()
        : this.clearAllSelected()
    },

    clearAllSelected() {
      this.$refs.creativesTable.clearSelected()
      this.selectAll = false
    },

    selectRow(index, isRowSelected) {
      !isRowSelected
        ? this.$refs.creativesTable.selectRow(index)
        : this.$refs.creativesTable.unselectRow(index)
    }
  }
}
</script>

<style lang="scss" scoped>
.creative-img {
  img {
    width: 100%;
    max-width: 100px;
    height: auto;
  }
}
</style>
