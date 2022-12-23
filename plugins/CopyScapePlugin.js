import CopyScapeService from '~/services/CopyScapeService.js'

export default ({ app }, inject) => {
  inject('fetchCopyScape', CopyScapeService)
}
