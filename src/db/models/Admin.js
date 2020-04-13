const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const moment = require("moment");

const config = require("../../config");

const adminSchema = new mongoose.Schema(
  {
    username: {
      type: mongoose.SchemaTypes.String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: mongoose.SchemaTypes.String,
      required: true,
    },
    loginDate: {
      type: mongoose.SchemaTypes.String,
    },
    loginTime: {
      type: mongoose.SchemaTypes.String,
    },
    token: {
      type: mongoose.SchemaTypes.String,
    },
  },
  {
    timestamps: true,
  }
);

adminSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 8);
  next();
});

adminSchema.statics.findByCredentials = async function (username, password) {
  try {
    const admin = await Admin.findOne({ username });
    const pwd = await bcrypt.compare(password, admin.password);
    if (!pwd) throw new Error("Password did not match!!");

    admin.token = await jwt.sign(
      { _id: admin._id.toString(), admin: admin.username },
      config.JWT_SECRET
    );

    admin.loginDate = moment().format("MMMM Do YYYY");
    admin.loginTime = moment().format("h:mm:ss a");
    await admin.save();
    return admin;
  } catch (error) {
    throw new Error(error);
  }
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
