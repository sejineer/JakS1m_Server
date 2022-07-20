import express from "express";
import {
  signin,
  signup,
  startKakaoLogin,
  finishKakaoLogin,
} from "../controllers/authController";

const authRoutes = express.Router();

//CREATE A USER
authRoutes.post("/signup", signup);

//SIGN IN
authRoutes.post("/signin", signin);

authRoutes.get("/kakao/start", startKakaoLogin);
authRoutes.get("/kakao/finish", finishKakaoLogin);
export default authRoutes;
