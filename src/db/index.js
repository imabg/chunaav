const mongoose = require("mongoose");
const config = require("../config");

module.exports = mongoose.connect(`${config.MONGODB_URL}/chunav`, {
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
});
