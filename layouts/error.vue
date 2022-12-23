<template>
  <section
    id="dashboard"
    class="dashboard"
    :class="{ darktheme: isDarkActive }"
  >
    <div class="container-fluid p-0">
      <div class="d-flex cstm-flex">
        <IncludeSidebar />
        <div
          class="db-content vh-200 p-0 d-flex flex-column justify-content-center align-items-center"
        >
          <h1 v-if="error.statusCode === 404">Page not found</h1>
          <h1 v-else>An error occurred - {{ error.statusCode }}</h1>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  props: ['error'],
  methods: {
    ...mapActions(['toggleDarkTheme'])
  },
  computed: {
    ...mapState(['isDarkActive'])
  },
  mounted() {
    const isDarkmode = this.$cookies.get('darkmode')

    if (isDarkmode) {
      this.darkMode = isDarkmode == 'true'
      this.toggleDarkTheme(isDarkmode == 'true')
    } else {
      this.darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
      this.toggleDarkTheme(this.darkMode)
    }
  }
}
</script>
