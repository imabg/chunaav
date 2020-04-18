const mongoose = require("mongoose");
const config = require("../config");

module.exports = mongoose.connect("mongodb://localhost:27017/chunav", {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});
