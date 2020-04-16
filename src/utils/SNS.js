const AWS = require("aws-sdk");

const { NEW_VOTER } = require("./MessageTemplates");

module.exports = (phone_num) => {
  var params = {
    Message: NEW_VOTER,
    PhoneNumber:  phone_num,
  };

  var publishTextPromise = new AWS.SNS({
    accessKeyId: process.env.AWS_SNS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SNS_SECRET_ACCESS_KEY,
    region: process.env.AWS_SNS_REGION,
  })
    .publish(params)
    .promise();

  publishTextPromise
    .then(function (data) {
      return JSON.stringify({ MessageID: data.MessageId });
    })
    .catch(function (err) {
      return JSON.stringify({ Error: err });
    });
};
