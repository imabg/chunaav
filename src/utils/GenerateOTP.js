// Genrate a 5-digit numeric code
const generateOTP = () => {
  return Math.floor(Math.random() * 10000) + 10000;
};

module.exports = generateOTP;
