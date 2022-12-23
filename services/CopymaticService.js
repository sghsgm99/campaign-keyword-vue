export default function (creativity, content) {
  let entity = 'copymatic'
  let payload = {
    url: process.env.copyMaticUrl,
    token: `Bearer ${process.env.copyMaticToken}`,
    model: process.env.copyMaticModel,
    tone: process.env.copyMaticTone,
    language: process.env.copyMaticLanguage,
    creativity: creativity,
    content: content
  }
  return this.$axios.post(entity, payload)
}
