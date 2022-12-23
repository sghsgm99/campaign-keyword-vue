var axios = require('axios').default

export default function (content, limit) {
  let temperature = 0.45;
  let top_p = 0.9
  let options = {
    method: 'GET',
    url: `${process.env.generalAssistantUrl}/${content}/${limit}/${temperature}/${top_p}/FALSE/`,
    headers: {
      'content-type': 'application/json',
      'x-rapidapi-host': process.env.generalAssitantHost,
      'x-rapidapi-key': process.env.rapidApiKey,
    }
  }
  return axios
    .request(options)
    .then((response) => {
      return response.data.generated_text
    })
    .catch((e) => {
      let err = {
        value: "error",
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
