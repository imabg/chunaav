const Admin = require("../../db/models/Admin");
const Voter = require("../../db/models/Voter");
const Candidate = require("../../db/models/Candidates");

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

exports.fetchVoter = async(req, res) => {
  try {
    const aadhar_num = req.params;
    const voter = await Voter.findOne(aadhar_num);
    const voterDetails = voter.toObject()
    delete voterDetails.tokens
    res.send(responseHandler(voterDetails))
  } catch (error) {
    error.code = 401;
    res
      .status(error.code)
      .send({ success: false, code: error.code, err: error.message });
  }
}

exports.addVoter = async (req, res, next) => {
  try {
    const newVoter = new Voter(req.body);
    const saveVoter = await newVoter.save();
    if (saveVoter.email) {
      const mailObj = {
        to: saveVoter.email,
        from: config.MAIL_ID,
        subject: `Successfully register #${saveVoter.name} for Voting ✌`,
        type: "addVoter",
      };
      await sendMail(mailObj);
    }
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
    const voter = await Voter.findByIdAndUpdate(req.id);
    res.send(responseHandler(voter));
  } catch (error) {
    error.code = 404;
    res
      .status(error.code)
      .send({ success: false, code: error.code, err: error.message });
  }
};

exports.deleteVoter = async (req, res, next) => {
  try {
    const voter = await Voter.findByIdAndDelete(req.id);
    res.send(responseHandler("Deleted successfully"));
  } catch (error) {
    error.code = 404;
    res
      .status(error.code)
      .send({ success: false, code: error.code, err: error.message });
  }
};

exports.candidateDetails = async(req, res) => {
  try {
    const aadhar_num = req.params;
    const cand = await Candidate.findOne(aadhar_num);
    const candDetails = cand.toObject()
    delete candDetails.votes
    res.send(responseHandler(candDetails))
  } catch (error) {
    error.code = 401;
    res
      .status(error.code)
      .send({ success: false, code: error.code, err: error.message });
  }
}

exports.addCandidate = async (req, res, next) => {
  try {
    const cand = new Candidate(req.body);
    const saveCand = await cand.save();
    const vBody = Object.assign({}, req.body);
    delete vBody.position;
    const v = new Voter(vBody);
    await v.save();
    if (saveCand.email) {
      const mailObj = {
        to: saveCand.email,
        from: config.MAIL_ID,
        subject: `Successfully register #${saveCand.name} for #${saveCand.position} position`,
        type: "addCandidate",
      };
      await sendMail(mailObj);
    }
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
    const voter = await Candidate.findByIdAndUpdate(req.id);
    res.send(responseHandler(voter));
  } catch (error) {
    error.code = 404;
    res
      .status(error.code)
      .send({ success: false, code: error.code, err: error.message });
  }
};

exports.deleteCandidate = async (req, res, next) => {
  try {
    const voter = await Candidate.findByIdAndDelete(req.id);
    res.send(responseHandler("Deleted successfully"));
  } catch (error) {
    error.code = 404;
    res
      .status(error.code)
      .send({ success: false, code: error.code, err: error.message });
  }
};
