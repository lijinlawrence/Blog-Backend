import User from "../model/userSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// regsister USer

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
      bio: "",
      image: "",
    });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        password: user.password,
        bio: user.bio,
        image: user.image,
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message }) || "internal server error";
  }
};

// login User

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400);
      throw new Error("please fill all the fields");
    }
    const user = await User.findOne({ email });
    if (user && (await user.checkPassword(password))) {
      const token = jwt.sign(
        { userId: user._id, name: user.name },
        "secretkey123"
      );
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

// get Users

export const getUserProfile = async (req, res) => {
  const userId = req.payload;

  try {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update User Profile
export const updateUserProfile = async (req, res, next) => {
  const userId = req.payload;
  const { name, email, password, bio } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (name) user.name = name;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }
    if (req.file) user.image = `/uploads/${req.file.filename}`;
    if (bio) user.bio = bio;

    await user.save();

    res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};



// get All userId

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '_id'); // Fetch only the user IDs
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


export const deleteAllUsers = async (req, res) => {
  try {
    await User.deleteMany(); // Delete all user documents
    res.status(200).json({ message: 'All users deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
