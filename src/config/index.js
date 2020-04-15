require("dotenv").config();

module.exports = {
  SERVER_PORT: process.env.SERVER_PORT,
  MONGODB_URL: process.env.MONGODB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  MAIL_ID: process.env.MAIL_ID,
  Access_Key_ID: process.env.Access_Key_ID,
  Secret_Access_Key: process.env.AWS_Secret_Access_Key,
  CANDIDATES_BUCKET: process.env.AWS_CANDIDATES_BUCKET,
  VOTERS_BUCKET: process.env.VOTERS_BUCKET,
};
