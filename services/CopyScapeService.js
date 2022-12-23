var axios = require('axios').default

export default function (operation, content, activate_test) {
  let entity = 'copyscape'
  let payload = {
    url: process.env.copyScapeUrl,
    username: process.env.copyScapeUsername,
    token: process.env.copyScapeToken,
    operation: operation,
    content: content,
    activate_test: activate_test
  }
  return this.$axios.post(entity, payload)
}
