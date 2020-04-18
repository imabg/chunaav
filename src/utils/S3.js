const AWS = require("aws-sdk");
const { v1: uuidv1 } = require("uuid");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_Access_Key_ID,
  secretAccessKey: process.env.AWS_Secret_Access_Key,
});

module.exports = function (bucketName, file) {
  // Setting up S3 upload parameters
  const params = {
    Bucket: bucketName,
    Key: uuidv1(), // File name you want to save as in S3
    Body: file.buffer,
    ContentType: file.mimetype,
    ACL: "public-read"
  };

  // Uploading files to the bucket
  // s3.upload(params, function (err, data) {
  //   if (err) {
  //     throw err;
  //   }
  //   console.log(`File uploaded successfully. ${data.Location}`);
  // });
};
