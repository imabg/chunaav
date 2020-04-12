const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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
      trim: true,
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
  try {
    this.password = await bcrypt.hash(this.password, 8);
    next();
  } catch (error) {
    throw new Error(error);
  }
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
    await admin.save();
    return admin;
  } catch (error) {
    throw new Error(error);
  }
};

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
