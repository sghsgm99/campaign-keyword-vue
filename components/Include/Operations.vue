<template>
  <div
    class="data-head-left col-md-6 d-flex flex-row align-items-center m-0 p-0"
  >
    <nuxt-link
      :to="`${slug}/create`"
      class="btn create primary-btn text-center"
      v-if="
        (checkPermission(1) && slug !== 'articles' && slug !== 'collections') ||
        slug === 'automation'
      "
      >Create {{ slug.replace(/-/g, ' ') }}</nuxt-link
    >
    <b-dropdown
      v-else-if="checkPermission(1) && slug === 'articles'"
      :text="`Create ${slug}`"
      variant="pink-fill primary-btn w-100 custom-dropdown-toggle"
    >
      <b-dropdown-item
        v-for="type in articleType"
        :key="type.value"
        class="text-capitalize"
        @click="createArticle(type.value)"
        >{{ type.label.toLowerCase() }}</b-dropdown-item
      >
    </b-dropdown>
    <button
      v-b-modal.formCreateCollection
      class="btn create primary-btn text-center"
      v-else-if="checkPermission(1) && slug === 'collections'"
    >
      Create {{ slug }}
    </button>
    <nav v-if="showActions" class="crud-menu ms-2">
      <ul>
        <li>
          <span v-if="!showLinks"><i class="fas fa-copy"></i> Duplicate</span
          ><nuxt-link :to="`${slug}/create?id=${rowItem.id}`" v-else
            ><i class="fas fa-copy"></i> Duplicate</nuxt-link
          >
        </li>
        <li>
          <span v-if="!showLinks"><i class="fas fa-pencil-alt"></i> Edit</span
          ><nuxt-link
            :to="`${slug}/edit/${rowItem.id}`"
            v-if="checkPermission(2) && showLinks"
            ><i class="fas fa-pencil-alt"></i> Edit</nuxt-link
          >
        </li>
        <li>
          <span v-if="!showLinks"><i class="fas fa-trash-alt"></i> Delete</span
          ><a href="" v-else @click.prevent="doDelete"
            ><i class="far fa-trash-alt"></i> Delete</a
          >
        </li>
      </ul>
    </nav>

    <b-modal
      id="formCreateCollection"
      title="Create Collection"
      size="md"
      hide-footer
      centered
      header-bg-variant="headerlight"
      :dialog-class="{ darktheme: darkMode }"
    >
      <IncludeFormsCollectionsCreate />
    </b-modal>
  </div>
</template>

<style scoped>
span {
  color: #ccc;
  font-size: 0.875em;
  font-weight: 300;
  text-transform: uppercase;
}
a {
  color: #534747;
}
</style>

<script>
import error from '~/mixins/error'
import enums from '~/mixins/enums'
import Articles from '~/models/Articles'
import operationPermissions from '~/mixins/operationPermissions'
export default {
  data() {
    return {
      showLinks: false,
      rowItem: []
    }
  },
  props: {
    slug: {
      required: true,
      type: String
    },
    id: {
      required: false
    },
    showActions: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  mixins: [operationPermissions, error, enums],
  async mounted() {
    await this.getPermissions()
  },
  methods: {
    enableLinks(item) {
      this.rowItem = item[0]
      this.showLinks = item.length
    },
    doDelete() {
      this.$emit('deleteRecord', this.rowItem.id)
    },
    doDuplicate() {
      this.$emit('duplicateRecord', this.rowItem.id)
    },
    async createArticle(option = 1) {
      this.toggleBtnDisabled()
      let payload = {}
      payload.type = parseInt(option)
      await Articles.post(payload)
        .then((result) => {
          this.$router.push(
            `/articles/edit/${result.response.data.data.id}?new=true`
          )
        })
        .catch((err) => {
          this.showError(err.response)
        })
    },
    async deleteArticle() {
      if (this.id != 0) {
        await this.$axios.$delete('/articles/' + this.id)
        this.$nuxt.refresh()
      }
    }
  },
  computed: {
    darkMode() {
      return this.$store.state.isDarkActive
    }
  }
}
</script>
