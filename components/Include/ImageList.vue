<template>
  <div class="article-image-container" v-if="images.length > 0">
    <div
      v-for="(image, key) in images"
      v-bind:key="key"
      class="article-image"
      :class="{ featured: image.featured }"
      :style="{ backgroundImage: `url('${encodeURI(image.url)}')` }"
    >
      <i class="fas fa-check-circle" v-if="image.featured"></i>
      <div class="article-button-wrapper p-1">
        <div>
          <button @click="setPrimaryImage(image)" class="btn btn-primary mb-1">
            Set as primary
          </button>
        </div>
        <div>
          <button @click="deleteUploadedFile(image)" class="btn btn-secondary">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Articles from '~/models/Articles'

export default {
  props: {
    images: {
      type: Array
    },
    articleId: {
      type: Number,
      require: true
    }
  },

  data() {
    return {
      fileRecordsForUpload: []
    }
  },

  methods: {
    filesSelected: function (fileRecordsNewlySelected) {
      var validFileRecords = fileRecordsNewlySelected.filter(
        (fileRecord) => !fileRecord.error
      )

      this.fileRecordsForUpload =
        this.fileRecordsForUpload.concat(validFileRecords)
    },

    async deleteUploadedFile(image) {
      await Articles.deleteImage(this.$route.params.articleId, image.id)
        .then((_) => {
          this.fileDeleted(image)
        })
        .catch((e) => {
          this.showError(e.response)
        })
    },

    onBeforeDelete(fileRecord) {
      var i = this.fileRecordsForUpload.indexOf(fileRecord)
      if (i !== -1) {
        // queued file, not yet uploaded. Just remove from the arrays
        this.fileRecordsForUpload.splice(i, 1)
        var k = this.fileRecords.indexOf(fileRecord)
        if (k !== -1) this.fileRecords.splice(k, 1)
      } else {
        if (confirm('Are you sure you want to delete?')) {
          this.$refs.vueFileAgent.deleteFileRecord(fileRecord) // will trigger 'delete' event
        }
      }
    },

    fileDeleted(fileRecord) {
      var i = this.images.indexOf(fileRecord)
      if (i !== -1) {
        this.images.splice(i, 1)
      }
    },

    async setPrimaryImage(image) {
      await Articles.featureImage(this.$route.params.articleId, image.id).catch(
        (e) => {
          this.showError(e.response)
        }
      )
    }
  }
}
</script>
