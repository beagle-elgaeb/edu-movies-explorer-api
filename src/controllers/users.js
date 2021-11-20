const User = require("../models/user");
const NotFoundError = require("../errors/not-found-err");
const BadRequestError = require("../errors/bad-request-err");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.getUser = async (req, res, next) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError("Пользователь не найден");
    }

    res.send(user);
  } catch (err) {
    if (err.name === "CastError") {
      next(new BadRequestError("Невалидный id"));
      return;
    }

    next(err);
  }
};

module.exports.updateUser = async (req, res, next) => {
  const userId = req.user._id;
  const { name, email } = req.body;

  try {
    if (!name || !email ) {
      throw new BadRequestError("Переданы некорректные данные");
    }

    const userProfile = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true },
    );

    res.send(userProfile);
  } catch (err) {
    if (err.name === "ValidationError") {
      next(new BadRequestError("Переданы некорректные данные"));
      return;
    }

    if (err.name === "CastError") {
      next(new BadRequestError("Невалидный id"));
      return;
    }

    next(err);
  }
};