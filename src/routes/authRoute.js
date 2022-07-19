import express from "express";
import { signin, signup } from "../controllers/authController";

const authRoutes = express.Router();

//CREATE A USER
authRoutes.post("/signup", signup);

//SIGN IN
authRoutes.post("/signin", signin);

export default authRoutes;
