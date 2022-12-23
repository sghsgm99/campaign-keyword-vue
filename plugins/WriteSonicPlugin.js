import WriteSonicService from '~/services/WriteSonicService.js'

export default ({ app }, inject) => {
  inject('fetchWriteSonic', WriteSonicService)
}