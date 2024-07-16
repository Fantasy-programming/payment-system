const router = require("express").Router();
const userExtractor = require("../lib/middleware").userExtractor;

const User = require("../models/User");

router.get("/", async (request, response) => {
  const users = await User.find({});
  response.json(users);
});

router.get("/me", userExtractor, async (request, response) => {
  return response.json(request.user);
});

router.delete("/:id", async (request, response) => {
  try {
    await User.findByIdAndRemove(request.params.id);
    response.status(204).json({ message: "User deleted successfully" });
  } catch {
    response.status(400).json({ error: "malformatted id" });
  }
});

router.patch("/:id", async (request, response) => {
  const body = request.body;

  const user = {
    firstName: body.firstName,
    lastName: body.lastName,
    email: body.email,
    phone: body.phone,
    password: body.password,
    zone: body.zone,
    address: body.address,
    routerID: body.routerID,
    emailVerified: body.emailVerified,
    phoneVerified: body.phoneVerified,
    role: body.role,
  };

  const updatedUser = await User.findByIdAndUpdate(request.params.id, user, {
    new: true,
  });

  response.json(updatedUser);
});

router.get("/:id", async (request, response) => {
  const user = await User.findById(request.params.id);
  response.json(user);
});

module.exports = router;
