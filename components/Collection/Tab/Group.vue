<template>
  <b-row>
    <b-col xl="3" lg="4" class="mb-3">
      <div class="article-type-list form-container p-12px">
        <div
          class="article-type-card mb-12px"
          :class="{ selected: sel_id == 0 }"
        >
          <div class="type-card-content" @click="selectGroup(0)">
            <h3 class="mb-0"><i class="fas fa-home mr-2"></i> All Creatives</h3>
          </div>
        </div>

        <hr />

        <div
          class="article-type-card mb-12px"
          :class="{ selected: group.id == sel_id }"
          v-for="group in groups"
          :key="group.id"
        >
          <div class="actions">
            <button
              v-b-tooltip.hover
              title="Duplicate"
              @click="doGroupDuplicate(group.id)"
            >
              <i class="fas fa-copy"></i>
            </button>

            <button
              v-b-tooltip.hover
              title="Delete"
              @click="doGroupDelete(group.id)"
            >
              <i class="far fa-trash-alt"></i>
            </button>
          </div>
          <div
            class="type-card-content text-center"
            @click="selectGroup(group.id)"
          >
            <h3 class="mb-0">{{ group.name }}</h3>
          </div>
        </div>

        <button
          class="pink-link p-0 text-uppercase mt-3 ml-auto d-flex align-items-center"
          v-b-modal.formCreateGroup
        >
          <span class="add-circle mr-1"><i class="fas fa-plus"></i></span>
          Create Group
        </button>
      </div>
    </b-col>

    <b-col xl="9" lg="8">
      <b-alert v-model="showToast" dismissible fade v-if="toast.message">
        <div class="d-flex justify-content-between">
          <span>{{ toast.message }}</span>
        </div>
      </b-alert>

      <h2 class="h5">{{ selectedGroup }}</h2>

      <div v-if="sel_id == 0">
        <label class="form-label mb-2">Upload Images from your computer</label>
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
      </div>

      <label class="form-label mb-2">Image List</label>

      <div class="action d-flex justify-content-between mb-2">
        <div class="d-flex align-items-center">
          <b-form-checkbox
            v-model="filterTypes.search"
            @change="handleFilter()"
            class="pink-checkbox custom-inline-checkbox font-12px"
          >
            Search: <span class="text-pink">{{ searchLength }}</span>
          </b-form-checkbox>

          <b-form-checkbox
            v-model="filterTypes.uploads"
            @change="handleFilter()"
            class="pink-checkbox custom-inline-checkbox font-12px ml-3"
          >
            Uploads:
            <span class="text-pink">{{ uploadsLength }}</span>
          </b-form-checkbox>
        </div>
        <div>
          <b-button
            variant="plain"
            size="sm"
            class="text-capitalize font-12px"
            v-b-modal.formAddCreative
            v-if="sel_id != 0"
            ><i class="fas fa-images"></i> Add more creatives</b-button
          >

          <b-button
            variant="plain"
            size="sm"
            class="text-capitalize font-12px"
            :disabled="!selectedLength"
            @click="deleteSelected"
            ><span class="far fa-trash-alt"></span> Delete</b-button
          >
        </div>
      </div>

      <IncludeFormsCollectionsCreativesTable
        :items="creativeList"
        :busy="isBusy"
        :selectedItems="pageSelectedItems"
        @row-selected="onRowSelected"
        :key="collectionsKey"
      />

      <IncludePagination
        ref="operations"
        :pagination="pagination"
        @doUpdatePagination="doUpdatePagination"
      />
    </b-col>

    <b-modal
      id="formCreateGroup"
      title="Create Collection Group"
      size="xl"
      hide-footer
      centered
      :dialog-class="{ darktheme: darkMode }"
      header-bg-variant="headerlight"
    >
      <IncludeFormsCollectionsCreateGroup @success="handleShowToast" />
    </b-modal>

    <b-modal
      id="formAddCreative"
      title="Add More Creatives"
      size="xl"
      hide-footer
      centered
      :dialog-class="{ darktheme: darkMode }"
      header-bg-variant="headerlight"
    >
      <IncludeFormsCollectionsAddCreative
        :groupId="sel_id"
        @success="handleShowToast"
      />
    </b-modal>
  </b-row>
</template>

<script>
import Collections from '~/models/Collections'

export default {
  data() {
    return {
      formData: [],
      fileRecords: [],
      fileRecordsForUpload: [],
      groups: [],
      sel_id: 0,
      creatives: [],
      isBusy: false,
      pagination: {
        currentPage: 1,
        totalRows: 0,
        perPage: 0,
        items: 1
      },
      pageSelCreatives: {},
      allPageSelected: {},
      toast: {
        message: null
      },
      showToast: false,
      filterTypes: {
        search: true,
        uploads: true
      },
      selectedType: null,
      collectionsKey: 1
    }
  },
  async fetch() {
    if (this.$route.params.id && this.$route.name.indexOf('edit') != -1) {
      this.getGroups()
      this.getCreatives()
    }
  },
  created() {
    this.isBusy = true
    this.$nuxt.$on('emit-refresh-group', (payload) => {
      if (payload['message'] == 'success') this.getGroups()
    }),
      this.$nuxt.$on('emit-refresh-creative', (payload) => {
        if (payload['message'] == 'success') this.getCreatives()
      })
  },
  methods: {
    selectGroup(gid) {
      this.sel_id = gid
      this.getCreatives()
    },

    async getGroups() {
      const id = this.$route.params.id

      await Collections.getGroups(id).then((res) => {
        this.groups = res.response.data.data
      })
    },

    async getCreatives() {
      this.isBusy = true
      await Collections.setPerPage(this.pagination.perPage)
        .setPage(this.pagination.currentPage)
        .setType(this.selectedType)
        .getCreatives(this.sel_id)
        .then((res) => {
          let list_creatives = res.response.data.data

          this.setPagination(res.response.data)

          this.creatives = list_creatives.map((d) => {
            if (this.sel_id == 0) {
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
            }

            return {
              ...d,
              description: d.text,
              image: d.data
                ? Array.isArray(d.data.image)
                  ? [...d.data.image]
                  : d.data.image
                : d.image
            }
          })

          this.isBusy = false
          this.collectionsKey++
        })
    },

    async doGroupDelete(id) {
      await this.$fire({
        title: 'Confirm',
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
            Collections.deleteGroup(id)
              .then(async (res) => {
                const response = res.response.data
                this.handleShowToast(response.message)
                this.isBusy = false
                this.getGroups()
                if (id == this.sel_id) {
                  this.selectGroup(0)
                }
              })
              .catch((err) => {
                this.isBusy = false
              })
          }
        })
        .catch((err) => {})
    },

    async doGroupDuplicate(id) {
      this.isBusy = true
      await Collections.duplicateGroup(id)
        .then((res) => {
          const response = res.response.data
          this.handleShowToast(response.message)
          this.selectGroup(response.data.id)
          this.isBusy = false
          this.getGroups()
        })
        .catch((err) => {
          this.isBusy = false
        })
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

      await Collections.uploadCreative(this.sel_id, this.formData).then(
        (res) => {
          this.handleShowToast(res.response.data.message)
          this.fileRecords = []
          this.getCreatives()
        }
      )
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
    },

    async deleteSelected() {
      await this.$fire({
        title: 'Are you sure?',
        text: 'Do you really want to delete these creative images?',
        type: 'question',
        showCancelButton: true,
        customClass: {
          container: this.darkMode ? 'darktheme' : ''
        }
      })
        .then((result) => {
          if (result.value) {
            this.isBusy = true
            this.setAllSelected()
            let ids = []
            Object.keys(this.allPageSelected).forEach((key) => {
              ids = [...ids, ...this.allPageSelected[key]]
            })
            ids = ids.map((d) => d.id)

            if (this.sel_id == 0) {
              Collections.removeCreative({ creative_ids: ids })
                .then((res) => {
                  this.allPageSelected = {}
                  this.handleShowToast(res.response.data.message)
                  this.isBusy = false
                  this.getCreatives()
                })
                .catch((err) => {
                  this.isBusy = false
                })
            } else {
              Collections.deleteCreativeFromGroup(this.sel_id, {
                group_creative_ids: ids
              })
                .then((res) => {
                  this.allPageSelected = {}
                  this.handleShowToast(res.response.data.message)
                  this.isBusy = false
                  this.getCreatives()
                })
                .catch((err) => {
                  this.isBusy = false
                })
            }
          }
        })
        .catch((err) => {})
    },

    handleShowToast(message) {
      this.showToast = true
      this.toast.message = message
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
    selectedGroup() {
      return this.sel_id === 0
        ? 'All Creatives'
        : this.groups.filter((item) => item.id == this.sel_id)[0]?.name
    },
    darkMode() {
      return this.$store.state.isDarkActive
    },
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
    searchLength() {
      return this.creatives.filter((item) => item.headline).length
    },
    uploadsLength() {
      return this.creatives.filter((item) => !item.headline).length
    },
    pageSelectedItems() {
      if (this.allPageSelected) {
        return this.allPageSelected[this.pagination.currentPage]
      }
      return {}
    },
    selectedLength() {
      if (this.allPageSelected) {
        let ids = []
        Object.keys(this.allPageSelected).forEach((key) => {
          ids = [...ids, ...this.allPageSelected[key]]
        })
        return ids.length
      }
      return !this.pageSelCreatives[this.pagination.currentPage]?.length
    }
  }
}
</script>

<style lang="scss" scoped>
.article-type-card {
  background-color: transparent;
  border-color: transparent;
  cursor: pointer;

  &:hover {
    background-color: #ebf1f0;
  }

  &.selected {
    background-color: #f24272;
    color: white;

    .actions {
      > * {
        color: white;
      }
    }
  }

  .type-card-content {
    min-height: auto;
    padding: 10px;

    &:after {
      display: none;
    }
  }

  .actions {
    top: 50%;
    transform: translateY(-50%);
  }
}

.darktheme .article-type-card {
  &:hover {
    background-color: #575a5e;
    border-color: #575a5e;
  }
}
</style>
