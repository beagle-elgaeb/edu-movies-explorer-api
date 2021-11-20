const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const ConflictError = require("../errors/conflict-err");
const BadRequestError = require("../errors/bad-request-err");
const Unauthorized = require("../errors/unauthorized-err");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    if (!user) {
      throw new BadRequestError("Переданы некорректные данные");
    }

    res.send({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (err) {
    if (err.name === "MongoServerError" && err.code === 11000) {
      next(new ConflictError("Этот пользователь уже зарегистрирован"));
      return;
    }

    if (err.name === "ValidationError") {
      next(new BadRequestError("Переданы некорректные данные"));
      return;
    }

    next(err);
  }
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findUserByCredentials(email, password);

    if (!user) {
      throw new Unauthorized("Ошибка авторизации");
    }

    const token = jwt.sign(
      { _id: user._id },
      NODE_ENV === "production" ? JWT_SECRET : "dev-secret",
      { expiresIn: "7d" },
    );

    res
      .cookie("jwt", token, {
        secure: true,
        sameSite: "none",
        httpOnly: true,
        maxAge: 7 * 24 * 3600 * 1000,
      })
      .send({ message: "Авторизация выполнена" });
  } catch (err) {
    next(err);
  }
};

module.exports.logout = async (req, res) => {
  res.clearCookie("jwt").send({ success: true });
};
