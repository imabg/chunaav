const AWS = require("aws-sdk");

module.exports = (phone_num, body) => {
  const smsQuery = { PhoneNumber: phone_num, Message: body };
  var publishTextPromise = new AWS.SNS({
    accessKeyId: process.env.AWS_SNS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SNS_SECRET_ACCESS_KEY,
    region: process.env.AWS_SNS_REGION,
  })
    .publish(smsQuery)
    .promise();

  publishTextPromise
    .then(function (data) {
      return JSON.stringify({ MessageID: data.MessageId });
    })
    .catch(function (err) {
      console.log(err);
      return JSON.stringify({ Error: err });
    });
};
