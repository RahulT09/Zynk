import httpStatus from "http-status";
import { User } from "../models/user_model.js";
import bcrypt, { hash } from "bcrypt";
import crypto from "crypto";

const login = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "please provide" });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "User_Not_Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }
    let token = crypto.randomBytes(20).toString("hex");

    user.token = token;
    await user.save();
    return res.status(httpStatus.OK).json({ token: token });
  } catch (e) {
    return res
      .status(httpStatus.INTERNAL_SERVER_ERROR)
      .json({ message: "Something went wrong" });
  }
};

const register = async (req, res) => {
  let { username, password, name } = req.body;

  try {
    if (!username || !password || !name) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ message: "Please Provide all field" });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(httpStatus.CONFLICT)
        .json({ message: "User already exists" });
    }

    const hashP = await bcrypt.hash(password, 10);

    const newUser = new User({
      name: name,
      username: username,
      password: hashP,
    });

    await newUser.save();
    res.status(httpStatus.CREATED).json({ message: "User registered" });
  } catch (e) {
    res.json({ message: "something went wrong" });
  }
};

export { login, register };
