export default {
  data() {
    return {
      allowedPages: []
    }
  },
  async mounted() {
    await this.getPermissions()
  },
  methods: {
    async getPermissions() {
      if (this.$auth.user) {
        const user = this.$auth.user
        user.role_setup.forEach((r) => {
          this.allowedPages.push(r.page)
        })
      }
    },
    checkPermission(id) {
      if (this.allowedPages.length && this.allowedPages.includes(id))
        return true
    }
  }
}
