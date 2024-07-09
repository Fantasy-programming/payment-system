const bcrypt = require("bcrypt");
const userRouter = require("express").Router();
const User = require("../models/User");

userRouter.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

userRouter.post("/", async (request, response) => {
  const { username, name, password } = request.body;

  // Validate password length
  if (!password || password.length < 3) {
    return response
      .status(400)
      .json({ error: "password must be at least 3 characters long" });
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    name,
    passwordHash,
  });
  try {
    const savedUser = await user.save();
    response.status(201).json(savedUser);
  } catch {
    response.status(400).json({ error: "expected `username` to be unique" });
  }
});

module.exports = userRouter;
