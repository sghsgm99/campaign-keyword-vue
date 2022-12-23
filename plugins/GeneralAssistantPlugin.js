import GeneralAssitantService from '~/services/GeneralAssistantService.js'

export default ({ app }, inject) => {
  inject('fetchGeneralAssistant', GeneralAssitantService)
}
