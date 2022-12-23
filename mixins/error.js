export default {
  data() {
    return {
      btnDisabled: false
    }
  },
  methods: {
    showError(response) {
      let errors = []
      if (typeof response != 'undefined') {
        let body = ''

        if (typeof response.data !== 'undefined') {
          body = `${response.data}`
        }

        if (typeof response.data !== 'undefined') {
          body = `${response.data.message}`
        }

        if (typeof response.data.message.title !== 'undefined') {
          body = `${response.data.message.title} - ${response.data.message.body}`
        }

        if (typeof response.data.data !== 'undefined') {
          body = `${response.data.data.message.title}`
        }

        if (response.data.errors) {
          Object.keys(response.data.errors).forEach((err) => {
            errors.push(response.data.errors[err][0] + ' ')
          })
          body = errors[0]
        }

        this.$bvToast.toast(errors, {
          title: `Error: ${body}`,
          toaster: 'b-toaster-bottom-right',
          variant: 'danger',
          headerClass: 'float-none mb-0',
          bodyClass: 'd-none',
          //autoHideDelay: 5000,
          noAutoHide: true
        })
      }
      this.toggleBtnDisabled()
    },
    toggleBtnDisabled() {
      this.btnDisabled = !this.btnDisabled
    }
  }
}
