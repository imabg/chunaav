const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const config = require("../../config");

const voterSchema = new mongoose.Schema(
  {
    image: {
      type: mongoose.SchemaTypes.String,
    },
    name: {
      type: mongoose.SchemaTypes.String,
      required: true,
      trim: true,
    },
    email: {
      type: mongoose.SchemaTypes.String,
      trim: true,
    },
    fname: {
      type: mongoose.SchemaTypes.String,
      trim: true,
      required: true,
    },
    aadhar_num: {
      type: mongoose.SchemaTypes.Number,
      required: true,
      unique: true,
      trim: true,
    },
    country_code: {
      type: mongoose.SchemaTypes.String,
      default: "+91",
    },
    phone_num: {
      type: mongoose.SchemaTypes.Number,
      required: true,
      unique: true,
      trim: true,
    },
    ward_num: {
      type: mongoose.SchemaTypes.Number,
      required: true,
    },
    city: {
      type: mongoose.SchemaTypes.String,
      required: true,
      trim: true,
    },
    isVoted: {
      type: mongoose.SchemaTypes.Boolean,
      default: false,
    },
    token: {
      type: mongoose.SchemaTypes.String,
    },
    loginCounter: {
      type: mongoose.SchemaTypes.Number,
      default: 0,
    },
  },
  { timestamps: true }
);

voterSchema.statics.findByCredentials = async function (aadhar_num, phone_num) {
  try {
    const voter = await Voter.findOne({ aadhar_num, phone_num });
    if (voter) {
      if (voter.isVoted) {
        throw new Error("You already cast your vote.");
      }
    } else {
      throw new Error("Aadhar number or Password won't match");
    }
    if (!voter) throw new Error("Aadhar number is not register");
    voter.loginCounter = voter.loginCounter + 1;
    voter.token = await jwt.sign(
      { _id: voter._id.toString(), expiresIn: 300000 },
      config.JWT_SECRET
    );
    await voter.save();
    return voter;
  } catch (error) {
    throw new Error(error);
  }
};

voterSchema.statics.findTheDetails = async function (id) {
  const voter = await Voter.findById(id);
  let details = Object.assign({}, voter);
  delete details.updatedAt;
  delete details.isVoted;
  delete details.phone_num;
  return details;
};

const Voter = mongoose.model("Voter", voterSchema);

module.exports = Voter;
