const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const Unauthorized = require("../errors/unauthorized-err");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: "Некорректный email",
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    required: true,
    minlength: [2, "Слишком короткое имя"],
    maxlength: [30, "Слишком длинное имя"],
  },
});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = async function (email, password) {
  const user = await this.findOne({ email }).select("+password");

  if (!user) {
    throw new Unauthorized("Переданы некорректные данные");
  }

  const matched = await bcrypt.compare(password, user.password);

  if (!matched) {
    throw new Unauthorized("Переданы некорректные данные");
  }

  return user;
};

module.exports = mongoose.model("user", userSchema);
