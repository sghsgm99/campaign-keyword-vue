export default {
  methods: {
    createBase64Image(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    }
  }
}
