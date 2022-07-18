import { createError } from "../error";
import User from "../models/User";
import bcrypt from "bcrypt";

export const signup = async (req, res, next) => {
  try {
    const { email, password, password1, name } = req.body;
    if (password !== password1) {
      return next(createError(400, "비밀번호가 일치하지 않습니다."));
    }
    const isExist = await User.exists({ email });
    console.log(isExist);
    if (isExist) {
      return next(createError(400, "이미 존재하는 이메일입니다."));
    }
    await User.create({
      email,
      password,
      name,
    });
    return res.status(200).send("회원가입 되었습니다");
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(createError(404, "존재하지 않는 아이디입니다."));
    }
    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      return next(createError(400, "비밀번호가 일치하지 않습니다"));
    }
  } catch (err) {
    next(err);
  }
};
