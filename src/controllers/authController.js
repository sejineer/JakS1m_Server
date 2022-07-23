import { createError } from "../error";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fetch from "cross-fetch";

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
    return res.status(200).send("success");
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
    const token = jwt.sign({ id: user._id }, process.env.JWT);
    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(user);
  } catch (err) {
    next(err);
  }
};

export const loginWithKakao = async (req, res, next) => {
  try {
    const host = "https://kauth.kakao.com/oauth/token";
    const config = {
      grant_type: "authorization_code",
      client_id: process.env.KAKAO_KEY,
      redirect_uri: "http://localhost:3000/join/oauth/kakao",
      code: req.body.code,
      client_secret: process.env.KAKAO_SECRET,
    };
    const params = new URLSearchParams(config).toString();
    const tokenRequestUrl = `${host}?${params}`;
    const tokenRequset = await (
      await fetch(tokenRequestUrl, {
        method: "POST",
        headers: {
          Content_type: "application/json",
        },
      })
    ).json();
    if ("access_token" in tokenRequset) {
      const { access_token } = tokenRequset;
      const url = "https://kapi.kakao.com/v2/user/me";
      const userData = await (
        await fetch(url, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
      ).json();
      console.log(userData);
      if (!userData.kakao_account.has_email) {
        return next(createError(404, "이메일이 존재하지 않습니다."));
      }
      let user = await User.findOne({ email: userData.kakao_account.email });
      if (!user) {
        user = await User.create({
          email: userData.kakao_account.email,
          password: "",
          img: userData.properties.profile_image,
          name: userData.kakao_account.profile.nickname,
          fromKakao: true,
        });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(user);
    } else {
      return next(createError(404, "Access Token이 존재하지 않습니다."));
    }
  } catch (err) {
    next(err);
  }
};

export const loginWithNaver = async (req, res, next) => {
  try {
    const host = "https://nid.naver.com/oauth2.0/token";
    const config = {
      grant_type: "authorization_code",
      client_id: process.env.NAVER_KEY,
      client_secret: process.env.NAVER_SECRET,
      code: req.body.code,
      state: req.body.state,
    };
    const params = new URLSearchParams(config).toString();
    const tokenRequestUrl = `${host}?${params}`;
    const tokenRequest = await (
      await fetch(tokenRequestUrl, {
        method: "POST",
      })
    ).json();
    if ("access_token" in tokenRequest) {
      const { access_token } = tokenRequest;
      const url = "https://openapi.naver.com/v1/nid/me";
      const userData = await (
        await fetch(url, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        })
      ).json();
      console.log(userData);
      let user = await User.findOne({ email: userData.response.email });
      if (!user) {
        user = await User.create({
          email: userData.response.email,
          password: "",
          img: userData.response.profile_image,
          fromNaver: true,
          name: userData.response.name,
        });
      }
      const token = jwt.sign({ id: user._id }, process.env.JWT);
      res
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(user);
    } else {
      return next(createError(404, "Access Token이 존재하지 않습니다"));
    }
  } catch (err) {
    next(err);
  }
};
