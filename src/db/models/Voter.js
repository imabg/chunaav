const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const config = require("../../config");

const voterSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.SchemaTypes.String,
      required: true,
      trim: true,
    },
    email: {
      type: mongoose.SchemaTypes.String,
      unique: true,
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
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

voterSchema.statics.findByCredentials = async function (aadhar_num, phone) {
  try {
    const voter = await Voter.findOne({ aadhar_num, phone });
    if (voter.isVoted) {
      throw new Error("You already cast your vote.");
    }
    if (!voter) throw new Error("Aadhar number is not register");
    const token = await jwt.sign(
      { _id: voter._id.toString(), expiresIn: 300000 },
      config.JWT_SECRET
    );
    voter.tokens = voter.tokens.concat({ token });
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
