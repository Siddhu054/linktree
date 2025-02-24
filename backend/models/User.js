const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const appearanceSchema = new mongoose.Schema({
  theme: {
    type: String,
    enum: ["light", "dark", "custom"],
    default: "light",
  },
  backgroundColor: {
    type: String,
    default: "#ffffff",
  },
  buttonStyle: {
    type: String,
    enum: ["filled", "outline", "soft"],
    default: "filled",
  },
  buttonColor: {
    type: String,
    default: "#6366f1",
  },
  buttonShape: {
    type: String,
    enum: ["rounded", "square", "pill"],
    default: "rounded",
  },
  layout: {
    type: String,
    enum: ["list", "grid", "minimal"],
    default: "list",
  },
  fontFamily: {
    type: String,
    enum: ["inter", "roboto", "poppins"],
    default: "inter",
  },
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    bannerImage: {
      type: String,
      default: "",
    },
    socialLinks: {
      instagram: { type: String, default: "" },
      twitter: { type: String, default: "" },
      facebook: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      github: { type: String, default: "" },
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    appearance: {
      type: appearanceSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

// Password hashing middleware
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
