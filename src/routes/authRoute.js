import express from "express";
import {
  signin,
  signup,
  loginWithKakao,
} from "../controllers/authController";

const authRoutes = express.Router();

//CREATE A USER
authRoutes.post("/signup", signup);

//SIGN IN
authRoutes.post("/signin", signin);

authRoutes.post("/kakao/login", loginWithKakao);
export default authRoutes;
