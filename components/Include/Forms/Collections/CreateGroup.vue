<template>
  <div>
    <form @submit.prevent="doFormAction">
      <b-row class="pb-2">
        <b-col cols="12">
          <label class="form-label pb-2">Collection Group</label>
          <input
            type="text"
            class="form-control mb-1"
            v-model.trim="$v.form.name.$model"
            :class="{ 'form-group--error': $v.form.name.$error }"
            autocomplete="false"
          />
          <div v-if="$v.form.name.$dirty">
            <small class="text-error" v-if="!$v.form.name.required"
              >Collection Group Name is required</small
            >
          </div>
        </b-col>
      </b-row>

      <b-row class="dashboard mt-3">
        <b-col>
          <div
            class="action d-flex justify-content-between align-items-center mb-2"
          >
            <div class="d-flex align-items-center">
              <b-form-checkbox
                v-model="filterTypes.search"
                @change="handleFilter()"
                class="pink-checkbox custom-inline-checkbox font-12px"
              >
                Search
              </b-form-checkbox>

              <b-form-checkbox
                v-model="filterTypes.uploads"
                @change="handleFilter()"
                class="pink-checkbox custom-inline-checkbox font-12px ml-3"
              >
                Uploads
              </b-form-checkbox>
            </div>
            <div>
              <div class="font-12px">
                <span class="text-pink">{{ selectedLength }}</span>
                creatives selected
              </div>
            </div>
          </div>

          <IncludeFormsCollectionsCreativesTable
            :items="creativeList"
            :busy="isBusy"
            @row-selected="onRowSelected"
            :selectedItems="pageSelectedItems"
            :key="collectionsKey"
          />

          <IncludePagination
            ref="operations"
            :pagination="pagination"
            @doUpdatePagination="doUpdatePagination"
          />
        </b-col>
      </b-row>

      <b-row class="justify-content-end mt-4">
        <b-col>
          <div
            class="form-bottom d-flex align-items-center justify-content-end"
          >
            <input
              type="submit"
              class="btn btn-primary primary-btn"
              value="Create"
              :disabled="btnDisabled"
            />
            <b-button
              class="btn px-4"
              variant="plain"
              @click="$bvModal.hide('formCreateGroup')"
              >Cancel</b-button
            >
          </div>
        </b-col>
      </b-row>
    </form>
  </div>
</template>

<script>
import Collections from '~/models/Collections'
import error from '~/mixins/error'
import { required } from 'vuelidate/lib/validators'

export default {
  layout: 'form',
  data() {
    return {
      selectedCreatives: [],
      pageSelCreatives: {},
      allPageSelected: {},
      creatives: [],
      form: {
        name: '',
        creative_ids: []
      },
      isBusy: false,
      pagination: {
        currentPage: 1,
        totalRows: 0,
        perPage: 0,
        items: 1
      },
      filterTypes: {
        search: true,
        uploads: true
      },
      selectedType: null,
      collectionsKey: 1
    }
  },
  mixins: [error],
  validations: {
    form: {
      name: {
        required
      }
    }
  },
  async fetch() {
    this.getCreatives()
  },
  methods: {
    cleanPayload() {
      let data = this.form
      data.user_id = this.$auth.user.id
      data.collection_id = Number(this.$route.params.id)
      return data
    },

    doFormAction() {
      return this.doFormPost()
    },

    async doFormPost() {
      this.toggleBtnDisabled()
      this.$v.$touch()
      if (this.$v.$invalid) {
        this.toggleBtnDisabled()
      } else {
        let payload = await this.cleanPayload()
        Collections.create({
          data: payload
        }).then((_) => {
          Collections.postGroup(payload)
            .then((res) => {
              $nuxt.$emit('emit-refresh-group', { message: 'success' })
              this.$emit('success', res.response.data.message)
              this.$bvModal.hide('formCreateGroup')
            })
            .catch((e) => {
              this.showError(e.response)
            })
        })
      }
    },

    async getCreatives() {
      this.isBusy = true
      await Collections.setPerPage(this.pagination.perPage)
        .setPage(this.pagination.currentPage)
        .setType(this.selectedType)
        .getCreatives(0)
        .then((res) => {
          this.collectionsKey++
          let list_creatives = res.response.data.data

          this.setPagination(res.response.data)

          this.creatives = list_creatives.map((d) => {
            return {
              id: d.id,
              ...d.data,
              image: d.data
                ? Array.isArray(d.data.image)
                  ? [...d.data.image]
                  : d.data.image
                : d.image,
              type: d.type
            }
          })

          this.selectedCreatives = []

          this.isBusy = false
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

      this.getCreatives()
    },

    onRowSelected(items) {
      this.pageSelCreatives = { [this.pagination.currentPage]: items }
      this.setAllSelected()
    },

    setAllSelected() {
      this.allPageSelected = {
        ...this.allPageSelected,
        ...this.pageSelCreatives
      }

      let ids = []
      Object.keys(this.allPageSelected).forEach((key) => {
        ids = [...ids, ...this.allPageSelected[key]]
      })

      this.form.creative_ids = ids.map((d) => d.id)
    },

    handleFilter() {
      if (!this.filterTypes.search && !this.filterTypes.uploads) {
        this.selectedType = 3
      } else if (!this.filterTypes.search) {
        this.selectedType = 2
      } else if (!this.filterTypes.uploads) {
        this.selectedType = 1
      } else {
        this.selectedType = null
      }

      this.getCreatives()
    }
  },
  computed: {
    creativeList() {
      return this.creatives.map((item, i) => {
        return {
          ...item,
          index: i,
          image: Array.isArray(item.image)
            ? item.image.length >= 1
              ? item.image[0]?.src ?? item.image[0]
              : null
            : item.image
        }
      })
    },
    pageSelectedItems() {
      if (this.allPageSelected) {
        return this.allPageSelected[this.pagination.currentPage]
      }
      return {}
    },
    selectedLength() {
      if (this.allPageSelected) {
        return this.form.creative_ids.length
      }
      return !this.pageSelCreatives[this.pagination.currentPage]?.length
    }
  }
}
</script>
