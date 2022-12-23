import ReadableApiService from '~/services/ReadableApiService.js'

export default ({ app }, inject) => {
  inject('fetchReadableApi', ReadableApiService)
}
