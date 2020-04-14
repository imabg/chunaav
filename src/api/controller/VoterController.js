const Voter = require("../../db/models/Voter");
const Candidate = require("../../db/models/Candidates");

const sendMail = require("../../utils/SendMail");
const config = require("../../config");
const responseHandler = require("../../utils/ResponseHandler");

exports.vote = async (req, res, next) => {
  try {
    const { name, ward_num, position, city, aadhar_num } = req.body;
    const cand = await Candidate.findOne({
      name,
      position,
      aadhar_num,
      ward_num,
      city,
    });
    const casteVote = await Candidate.findByIdAndUpdate(
      cand._id,
      { $inc: { votes: 1 } },
      { new: true }
    );
    const voter = await Voter.findByIdAndUpdate(req.id, { isVoted: true });

    // Sending Mail after the Vote
    if (voter.email) {
      const mailObj = {
        to: voter.email,
        from: config.MAIL_ID,
        subject: `Thanks ${voter.name} for Voting 🙏`,
        type: "voted",
      };
      sendMail(mailObj);
    }

    res.send(responseHandler("Thanks for voting"));
  } catch (error) {
    error.code = 403;
    res
      .status(error.code)
      .send({ success: false, code: error.code, err: error.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { aadhar_num, phone_num } = req.body;
    const voter = await Voter.findByCredentials(aadhar_num, phone_num);
    if (voter.email) {
      const mailObj = {
        to: voter.email,
        from: config.MAIL_ID,
        subject: `Welcome ${voter.name} on Chunaav: advanced and secure voting system`,
        type: "login",
      };
      sendMail(mailObj);
    }
    res.send(responseHandler(voter));
  } catch (error) {
    error.code = 404;
    res
      .status(error.code)
      .send({ success: false, code: error.code, err: error.message });
  }
};

exports.voterDetails = async (req, res, next) => {
  try {
    const voter = await Voter.findTheDetails(req.id);
    res.send(responseHandler(voter));
  } catch (error) {
    error.code = 401;
    res
      .status(error.code)
      .send({ success: false, code: error.code, err: error.message });
  }
};
