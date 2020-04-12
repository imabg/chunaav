const jwt = require("jsonwebtoken");
const Voter = require("../../db/models/Voter");
const Admin = require("../../db/models/Admin");
const config = require("../../config");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    let decoded = await jwt.verify(token, config.JWT_SECRET);
    if (decoded.admin) {
      const admin = await Admin.findOne({
        _id: decoded._id,
        token: token,
      });
      req.id = decoded._id;
      req.admin = admin;
    } else {
      const voter = await Voter.findOne({
        _id: decoded._id,
      });
      if (!voter) throw new Error("No User Found.");
      req.id = voter._id;
      req.voter = voter;
    }
    next();
  } catch (error) {
    error.code = 404;
    res
      .status(error.code)
      .send({ success: false, code: 404, message: "Not Authorized!" });
  }
};
