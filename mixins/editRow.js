export default {
  methods: {
    goToEditPage(event, check, route) {
      if(check) {
        this.$router.push(`${route}/${event.id}`)
      }
    },
  }
}