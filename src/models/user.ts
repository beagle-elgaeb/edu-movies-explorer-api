import bcrypt from 'bcryptjs';
import mongoose, { Model } from 'mongoose';
import validator from 'validator';
import { incorrectData, incorrectEmail } from '../constants';
import Unauthorized from '../errors/unauthorized-err';

export type UserData = {
  _id: string,
  email: string,
  password: string,
  name: string,
};

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email: string) {
        return validator.isEmail(email);
      },
      message: incorrectEmail,
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
    minlength: 2,
    maxlength: 30,
  },
});

userSchema.statics.findUserByCredentials = (
  async function findUserByCredentials(email: string, password: string) {
    const user = await this.findOne({ email }).select('+password');

    if (!user) {
      throw new Unauthorized(incorrectData);
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      throw new Unauthorized(incorrectData);
    }

    return user;
  }
);

interface UserModel extends Model<UserData> {
  findUserByCredentials: (email: string, password: string) => Promise<UserData>;
}

export default mongoose.model<UserData, UserModel>('user', userSchema);
