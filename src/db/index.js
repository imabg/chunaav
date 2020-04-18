const mongoose = require("mongoose");
const config = require("../config");

module.exports = mongoose.connect(
  `mongodb+srv://abhay676:kYwI9sVPG2e16ktB@chunaav-j6xfh.mongodb.net/chunaav`,
  {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  }
);
