let axios = require('axios').default
// process.env.writeSonicId
export default function (title, intro, section) {
  let param = 'ai-article-writer-v2'
  let options = {
    method: 'POST',
    url: process.env.writeSonicUrl + '/' + param,
    params: {
      end_user_id: process.env.writeSonicId,
      engine: process.env.writeSonicEngine,
      language: process.env.writeSonicLanguage
    },
    data: {
      article_title: title,
      article_intro: intro,
      article_sections: [section]
    },
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.writeSonicKey
    }
  }

  return axios
    .request(options)
    .then(function (response) {
      return response.data.data
    })
    .catch((e) => {
      let err = {
        value: 'error',
        status: 204,
        data: {
          message: 'Error',
          data: {
            message: {
              title: 'Content',
              body: 'Unavailable'
            }
          }
        }
      }
      return err
    })
}
