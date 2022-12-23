export default {
    data(){
        return {
            allowedPermissions : null
        }
    },
    async mounted () {
        await this.getPermissions()
    },
    methods : {
        async getPermissions() {
            const user = this.$auth.user
            user.role_setup.forEach(r => {
                if(this.$route.name.includes(r.page_name.toLowerCase()))
                {
                  this.allowedPermissions = r.permission
                }
            })
        },
        checkPermission(id) {
          if(this.allowedPermissions && this.allowedPermissions.includes(id)) {
            return true
          }
        }

    }
}
