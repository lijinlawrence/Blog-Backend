import  jwt  from "jsonwebtoken";


const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: "10d",
  });
  console.log(token);
  res.cookie("token", token, {
    httpOnly: true, //this
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 10 * 24 * 60 * 60 * 1000, //10days
  });
};

export default generateToken;
