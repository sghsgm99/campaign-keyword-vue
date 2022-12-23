import { ENUMS, getValue } from '~/enums'
import RouteList from '~/.nuxt/routes.json'
export default async function ({ store, route, redirect, $auth, $axios }) {
  if ($auth.loggedIn) {
    const routeExists = RouteList.filter((pages) => pages.name == route.name)
    await $axios.get('/auth/user').then((res) => {
      const { data } = res
      $auth.setUser(data.data.user)
    })
    const user = $auth.$state.user
    let allowed = false
    let subroute = null

    if (route.name == 'campaigns') {
      return redirect(`/${user.role_setup[0].page_name.toLowerCase()}`)
    }

    if (route.name == 'campaigns-facebookaudience') {
      return
    }

    if (route.name == 'admin-users') {
      return
    }

    if (route.name == 'privacy-policy') {
      return
    }

    if (route.name == 'dns-manager') {
      return
    }

    if (route.name == 'jubilee-sites-analytics') {
      return
    }

    if (route.name == 'adbuilders-pages-id') {
      return
    }

    if (route.name == 'facebook-campaigns') {
      return
    }

    if (
      route.name == 'automation' ||
      route.name == 'automation-create' ||
      route.name == 'automation-edit-id'
    ) {
      return
    }

    if (
      route.name == 'facebook-adsets-create' ||
      route.name == 'facebook-adsets-edit-id'
    ) {
      return
    }

    if (
      route.name == 'facebook-ads-create' ||
      route.name == 'facebook-ads-edit-id'
    ) {
      return
    }

    if (route.name == 'search-results') {
      if (user.role_label !== 'AUTHOR') {
        return
      }
    }

    if (!routeExists.length)
      return $nuxt.error({ statusCode: 404, message: 'Page not found!' })

    user.role_setup.forEach((r) => {
      if (
        route.name.includes(r.page_name.toLowerCase()) ||
        route.name == 'accounts'
      ) {
        allowed = true

        const allowedPermissions = r.permission.map((permit) =>
          getValue('PermissionTypeEnum', permit).toLowerCase()
        )

        subroute =
          route.name.indexOf('-') != -1
            ? route.name.replace(`${r.page_name.toLowerCase()}-`, '')
            : false

        if (subroute) {
          let flag = false
          allowedPermissions.forEach((p) => {
            if (subroute.includes(p)) {
              flag = true
              return
            }
          })

          allowed = flag
        }
      }
    })

    if (!allowed) redirect(`/${user.role_setup[0].page_name.toLowerCase()}`)
  } else {
  }
}
