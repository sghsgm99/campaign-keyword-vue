import TwinwordWordAssocService from '~/services/TwinwordWordAssocService.js'
import TwinwordSentimentAnalyzerService from '~/services/TwinwordSentimentAnalyzerService.js'

export default ({ app }, inject) => {
  inject('fetchTwinWordAssoc', TwinwordWordAssocService)
  inject('fetchTwinWordAnalyzer', TwinwordSentimentAnalyzerService)
}
