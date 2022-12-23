import CopymaticService from '~/services/CopymaticService.js'

export default ({ app }, inject) => {
  inject('fetchCopyMatic', CopymaticService)
}
