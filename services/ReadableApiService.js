var axios = require('axios').default

export default function (content, time, signature ) {
    let entity = 'readableapi'
    let payload = {
        url: process.env.readableUrl,
        time: time,
        signature: signature,
        content: content
    }
  return this.$axios.post(entity, payload)
}