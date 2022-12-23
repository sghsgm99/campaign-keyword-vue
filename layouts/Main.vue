<template>
  <section
    id="dashboard"
    class="dashboard"
    :class="{ darktheme: isDarkActive }"
  >
    <div style="container-fluid p-0">
      <div class="d-flex cstm-flex">
        <IncludeSidebar />
        <Nuxt />
      </div>
    </div>
  </section>
</template>

<script>
import { mapState, mapActions } from 'vuex'
export default {
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
