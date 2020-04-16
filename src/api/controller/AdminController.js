const Admin = require("../../db/models/Admin");
const Voter = require("../../db/models/Voter");
const Candidate = require("../../db/models/Candidates");

const S3 = require("../../utils/S3");
const SNS = require("../../utils/SNS")
const sendMail = require("../../utils/SendMail");
const responseHandler = require("../../utils/ResponseHandler");
const config = require("../../config");

exports.add = async (req, res, next) => {
  try {
    const admin = new Admin(req.body);
    const savedAdmin = await admin.save();
    res.send(responseHandler(savedAdmin._id));
  } catch (error) {
    error.code = 401;
    res
      .status(error.code)
      .send({ success: false, code: error.code, err: error.message });
  }
};

exports.fetchAdmin = async (req, res) => {
  try {
    const admin = await Admin.findById(req.id);
    const returnAdmin = admin.toObject();
    delete returnAdmin.password;
    delete returnAdmin.updatedAt;
    delete returnAdmin._id;
    delete returnAdmin.token;
    res.send(responseHandler(returnAdmin));
  } catch (error) {
    error.code = 404;
    res
      .status(error.code)
      .send({ success: false, code: error.code, err: error.message });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findByCredentials(username, password);
    res.send(responseHandler(admin));
  } catch (error) {
    error.code = 404;
    res
      .status(error.code)
      .send({ success: false, code: error.code, err: error.message });
  }
};

exports.fetchVoter = async (req, res) => {
  try {
    const aadhar_num = req.query.aadhar_num;
    const voter = await Voter.findOne({ aadhar_num: aadhar_num });
    if (!voter) throw new Error("Voter is not registered ✋");
    const voterDetails = voter.toObject();
    delete voterDetails.tokens;
    res.send(responseHandler(voterDetails));
  } catch (error) {
    error.code = 401;
    res
      .status(error.code)
      .send({ success: false, code: error.code, err: error.message });
  }
};

exports.addVoter = async (req, res, next) => {
  try {
    const newVoter = new Voter(req.body);
    const saveVoter = await newVoter.save();
    // TODO: remove the comments for final use
    // if (saveVoter.email) {
    //   const mailObj = {
    //     to: saveVoter.email,
    //     from: config.MAIL_ID,
    //     subject: `Successfully register #${saveVoter.name} for Voting ✌`,
    //     type: "addVoter",
    //   };
    //   await sendMail(mailObj);
    // }
    // const sendSms = SNS(saveCand.country_code saveVoter.phone_num)
    res.send(responseHandler(saveVoter));
  } catch (error) {
    error.code = 401;
    res
      .status(error.code)
      .send({ success: false, code: error.code, err: error.message });
  }
};

exports.updateVoter = async (req, res, next) => {
  try {
    const _id = req.query.id;
    const voter = await Voter.findByIdAndUpdate({ _id }, req.body);
    res.send(responseHandler("updated successfully"));
  } catch (error) {
    error.code = 404;
    res
      .status(error.code)
      .send({ success: false, code: error.code, err: error.message });
  }
};

exports.uploadVoterImage = async (req, res) => {
  try {
    const _id = req.params;
    const VOTERS_BUCKET = `${config.VOTERS_BUCKET}`;
    const upload = await S3(VOTERS_BUCKET, req.body);
    const voter = await Voter.findByIdAndUpdate({ _id }, { image: upload });
    res.send(responseHandler("Uploaded successfully"));
  } catch (error) {
    error.code = 406;
    res
      .status(error.code)
      .send({ success: false, code: error.code, err: error.messag });
  }
};

exports.deleteVoter = async (req, res, next) => {
  try {
    const _id = req.query.id;
    const voter = await Voter.deleteOne({_id});
    res.send(responseHandler("Deleted successfully"));
  } catch (error) {
    error.code = 404;
    res
      .status(error.code)
      .send({ success: false, code: error.code, err: error.message });
  }
};

exports.candidateDetails = async (req, res) => {
  try {
    const aadhar_num = req.params;
    const cand = await Candidate.findOne(aadhar_num);
    if (!cand) throw new Error("Candiate not found ⚡");
    const candDetails = cand.toObject();
    delete candDetails.votes;
    res.send(responseHandler(candDetails));
  } catch (error) {
    error.code = 401;
    res
      .status(error.code)
      .send({ success: false, code: error.code, err: error.message });
  }
};

exports.addCandidate = async (req, res, next) => {
  try {
    // TODO: email has to be checked in Voters before saving candiate
    // TODO: remove comments
    const candData = req.body.candidate;
    // delete req.body.candidate.position;
    const cand = new Candidate(candData);
    const saveCand = await cand.save();
    const vBody = Object.assign({}, candData);
    delete vBody.position;
    const v = new Voter(vBody);
    await v.save();
    // if (saveCand.email) {
    //   const mailObj = {
    //     to: saveCand.email,
    //     from: config.MAIL_ID,
    //     subject: `Successfully register #${saveCand.name} for #${saveCand.position} position`,
    //     type: "addCandidate",
    //   };
    //   await sendMail(mailObj);
    // }
    // const sendSms = SNS(saveCand.country_code saveCand.phone_num)
    res.send(responseHandler(saveCand));
  } catch (error) {
    console.log(error);
    error.code = 401;
    res
      .status(error.code)
      .send({ success: false, code: error.code, err: error.message });
  }
};

exports.updateCandidate = async (req, res, next) => {
  try {
    const _id = req.query.id;
    const candidate = await Candidate.findByIdAndUpdate({ _id }, req.body);
    res.send(responseHandler("update successdully"));
  } catch (error) {
    error.code = 404;
    res
      .status(error.code)
      .send({ success: false, code: error.code, err: error.message });
  }
};

exports.uploadCandidateLogo = async (req, res) => {
  try {
    const id = req.params.id;
    const CANDIDATES_BUCKET = `${config.CANDIDATES_BUCKET}`;
    const upload = await S3(CANDIDATES_BUCKET);
    await Candidate.findByIdAndUpdate({ id }, { logo: upload });
    res.send(responseHandler("Uploaded successfully"));
  } catch (error) {
    error.code = 406;
    res
      .status(error.code)
      .send({ success: false, code: error.code, err: error.message });
  }
};

exports.deleteCandidate = async (req, res, next) => {
  try {
    const _id = req.query.id;
    await Candidate.findByIdAndDelete(_id);
    res.send(responseHandler("Deleted successfully"));
  } catch (error) {
    error.code = 404;
    res
      .status(error.code)
      .send({ success: false, code: error.code, err: error.message });
  }
};
