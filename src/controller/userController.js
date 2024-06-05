import User from "../model/userSchema.js";
import generateToken from "../utils/generateToken.js";
import jwt from "jsonwebtoken";

export const createUser = async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);

  if (!name || !email || !password) {
    res.status(400);
    const err = new Error("Please provide name,email and pasword");
    return next(err);
  }

  if (password.length < 8) {
    res.status(400);
    const err = new Error("password ,must be atleast 8 character");
    return next(err);
  }

  const emailRegex = /^\S+@\S+\.\S+$/;
  if (!emailRegex.test(email)) {
    res.status(400);
    const err = new Error("Invalid email address");
    return next(err);
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      const err = new Error(
        "Email already registered, Please provide another email"
      );
      return next(err);
    }
    const user = await User.create({
      name,
      email,
      password,
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        password: user.password,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message }) || "internal server error";
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400);
      throw new Error("please fill all the fields");
    }
    const user = await User.findOne({ email });
    if (user && (await user.checkPassword(password))) {
      const token = jwt.sign({ userId: user._id, name: user.name }, "secretkey123");
      res.status(200).json({
        token,
        user, 
      });
    } else {
      res.status(400);
      throw new Error("invalid email or password");
    }
  } catch (error) {
    res.status(500).json({ error: error.message }) || "internal server error";
  }
};
