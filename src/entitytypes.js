module.exports = {
  book: {
    isbn: String,
    genre: String,
    additionalGenres: [{genre: String}],
    author: String,
    read: Boolean,
    language: String,
    ageGroup: String,
  },
}