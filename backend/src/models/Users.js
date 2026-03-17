const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { SaltValue } = require("../../example.env");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
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
      minlength: 3, 
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Hash password before saving user
UserSchema.pre("save", async function () {
  const user = this;

  try {
    if (!user.isModified("password")) {
      return;
    }

    const salt = await bcrypt.genSalt(Number(SaltValue));
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash; 
  } catch (err) {
    console.error("Error hashing password:", err); 
  }
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", UserSchema);
