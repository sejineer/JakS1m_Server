import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String },
    img: { type: String },
    fromKakao: { type: Boolean, default: false },
    fromNaver: { type: Boolean, default: false },
    name: { type: String, required: true },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
