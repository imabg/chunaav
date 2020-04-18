const Voter = require("../../db/models/Voter");
const Candidate = require("../../db/models/Candidates");

const sendMail = require("../../utils/SendMail");
const SNS = require("../../utils/SNS");
const {
  SUCCESSFULL_VOTE,
  INFO,
  OTPTemplate,
} = require("../../utils/MessageTemplates");
const genrateOTP = require("../../utils/GenerateOTP");
const config = require("../../config");
const responseHandler = require("../../utils/ResponseHandler");

exports.vote = async (req, res, next) => {
  try {
    const candidates = req.body;
    candidates.forEach(async (candidate) => {
      await Candidate.findByIdAndUpdate(
        candidate,
        { $inc: { votes: 1 } },
        { new: true }
      );
    });
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
    const number = voter.country_code + voter.phone_num;
    SNS(number, SUCCESSFULL_VOTE);
    res.send(responseHandler("Vote has been recorded"));
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
    if (voter.loginCounter !== 1) {
      throw new Error("You already cast your vote 🙏");
    }
    if (voter.email) {
      const mailObj = {
        to: voter.email,
        from: config.MAIL_ID,
        subject: `Welcome ${voter.name} on Chunaav: advanced and secure voting system`,
        type: "login",
      };
      sendMail(mailObj);
    }
    const number = voter.country_code + voter.phone_num;
    SNS(number, INFO);
    SNS(
      number,
      OTPTemplate +
        voter.OTP +
        " Please don't share the OTP with anyone. #TeamChunaav"
    );
    res.send(responseHandler(voter));
  } catch (error) {
    console.log(error);
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

exports.verifyOTP = async (req, res) => {
  try {
    const _id = req.query.id;
    const OTP = req.query.o;

    const voter = await Voter.findById(_id);
    if (voter.OTP !== parseInt(OTP)) {
      throw new Error("OTP won't match!");
    }
    res.send(responseHandler("OTP verified"));
  } catch (error) {
    error.code = 404;
    res.status(error.code).send({ success: false, err: error.message });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const id = req.query.id;
    const newOTP = genrateOTP();
    const voter = await Voter.findByIdAndUpdate(id, { OTP: newOTP });
    const number = voter.country_code + voter.phone_num;
    SNS(number, "OTP", newOTP);
    res.send(responseHandler("OTP is send"));
  } catch (error) {
    error.code = 401;
    res
      .status(error.code)
      .send({ success: false, code: error.code, err: error.message });
  }
};

exports.generateVotinScreen = async (req, res) => {
  try {
    const cityV = req.query.city;
    const ward_numV = req.query.ward;

    const query = {
      city: "" + cityV + "",
      ward_num: parseInt(ward_numV),
    };

    const result = await Candidate.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$position",
          candidates: {
            $push: {
              id: "$_id",
              name: "$name",
              city: "$city",
              ward_num: "$ward_num",
              logo: "$logo",
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          position: "$_id",
          candidates: "$candidates",
        },
      },
    ]);
    res.send(responseHandler(result));
  } catch (error) {
    error.code = 403;
    res
      .status(error.code)
      .send({ success: false, code: error.code, err: error.message });
  }
};
