require("dotenv").config();

module.exports = {
  SERVER_PORT: process.env.SERVER_PORT,
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  MAIL_ID: process.env.MAIL_ID,
};
