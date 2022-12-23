<template>
  <div>
    <form @submit.prevent="doFormAction">
      <b-row>
        <b-col>
          <label class="form-label mb-2">Upload new images</label>
          <div class="article-dropbox article-type-dropbox mb-2">
            <div class="dropbox-wrapper">
              <VueFileAgent
                ref="vueFileAgent"
                :multiple="false"
                :deletable="true"
                :meta="true"
                :accept="'image/*,'"
                :maxSize="'2MB'"
                :maxFiles="14"
                :helpText="'Upload a file or drag and drop'"
                :errorText="{
                  type: 'Invalid file type. Only images or zip Allowed',
                  size: 'Files should not exceed 2MB in size'
                }"
                :theme="'list'"
                @select="filesSelected($event)"
                v-model="fileRecords"
              ></VueFileAgent>
            </div>
          </div>
        </b-col>
      </b-row>
      <b-row class="dashboard mt-2">
        <b-col>
          <label class="form-label mb-2"
            >OR Select from the main collection</label
          >

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
              value="Add"
              :disabled="btnDisabled"
            />
            <b-button
              class="btn px-4"
              variant="plain"
              @click="$bvModal.hide('formAddCreative')"
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

export default {
  layout: 'form',
  props: ['groupId'],
  data() {
    return {
      formData: [],
      fileRecords: [],
      fileRecordsForUpload: [],
      pageSelCreatives: {},
      allPageSelected: {},
      creatives: [],
      form: {
        creative_ids: []
      },
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
  async fetch() {
    this.getCreatives()
  },
  methods: {
    cleanPayload() {
      let data = this.form

      return data
    },

    async constructFormData() {
      this.formData = new FormData()

      this.fileRecordsForUpload.forEach((img) => {
        this.formData.append('image', img.file)
      })
    },

    filesSelected: async function (fileRecordsNewlySelected) {
      var validFileRecords = fileRecordsNewlySelected.filter(
        (fileRecord) => !fileRecord.error
      )
      this.fileRecordsForUpload = validFileRecords
      await this.constructFormData()

      await Collections.uploadCreative(0, this.formData).then((res) => {
        let id = res.response.data.data.id
        this.fileRecords = []
        this.form.creative_ids = [id]
        this.doFormPost()
      })
    },

    doFormAction() {
      return this.doFormPost()
    },

    async doFormPost() {
      this.setAllSelected()
      this.toggleBtnDisabled()
      let payload = await this.cleanPayload()

      Collections.create({
        data: payload
      }).then((_) => {
        Collections.postGroupCreative(this.groupId, payload)
          .then((res) => {
            $nuxt.$emit('emit-refresh-creative', { message: 'success' })
            this.$emit('success', 'Collection Creative was added.')
            this.$bvModal.hide('formAddCreative')
          })
          .catch((e) => {
            this.showError(e.response)
          })
      })
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
      this.setAllSelected()
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
