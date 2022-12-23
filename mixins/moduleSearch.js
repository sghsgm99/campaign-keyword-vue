
import Articles from '~/models/Articles'

export default {
  methods : {
      async searchArticles(keyword = null) {
        await Articles.setSearch(keyword).collection().then( res => {
          return res.response.data.data
        })
      },

  }
}
