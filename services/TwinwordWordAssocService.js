let axios = require('axios').default
export default function (selectedText) {
  let options = {
    method: 'GET',
    url: process.env.twinWordUrlWordAssoc,
    params: { entry: selectedText },
    headers: {
      'x-rapidapi-host': process.env.twinWordHost,
      'x-rapidapi-key': process.env.rapidApiKey,
    },
  }
  return axios
    .request(options)
    .then(function (response) {
      return response.data.associations_array
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
