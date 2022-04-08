module.exports = {
  book: {
    readableName: "Books",
    schema: {
      name: {
        type: String,
        required: true,
      },
      isbn: String,
      genre: String,
      additionalGenres: [{genre: String}],
      author: String,
      read: Boolean,
      language: String,
      ageGroup: String,
    },
  },
  junk: {
    readableName: "Things",
    schema: {
      name: String,
      attr2: String,
    },
  },
}