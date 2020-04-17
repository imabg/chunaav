const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema(
  {
    logo: {
      type: mongoose.SchemaTypes.String,
      // required: true,
      trim: true,
    },
    name: {
      type: mongoose.SchemaTypes.String,
      required: true,
      trim: true,
    },
    fname: {
      type: mongoose.SchemaTypes.String,
      trim: true,
      required: true,
    },
    email: {
      type: mongoose.SchemaTypes.String,
      trim: true,
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
    position: {
      type: mongoose.SchemaTypes.String,
      required: true,
      trim: true,
    },
    votes: {
      type: mongoose.SchemaTypes.Number,
      default: 0,
    },
    OTP: {
      type: mongoose.SchemaTypes.Number,
    }
  },
  { timestamps: true }
);

const Candidate = mongoose.model("Candidate", candidateSchema);

module.exports = Candidate;
