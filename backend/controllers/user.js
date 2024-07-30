const router = require("express").Router();
const userExtractor = require("../lib/middleware").userExtractor;

const User = require("../models/User");

// Get all users
router.get("/", userExtractor, async (request, response) => {
  if (request.user.role === "admin") {
    const users = await User.find({
      role: { $ne: "admin" },
    }).sort({ createdAt: -1 });
    return response.json(users);
  }

  return response.status(403).json({ error: "Unauthorized" });
});

// Get current user info
router.get("/me", userExtractor, async (request, response) => {
  return response.json(request.user);
});

// Get a single user detail
router.get("/:id", async (request, response) => {
  const user = await User.findById(request.params.id);
  response.json(user);
});

// Create a new user
router.post("/", async (request, response) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    zone,
    routerID,
    address,
  } = request.body;

  // Validate required fields

  if (!email || !password) {
    return response.status(400).json({
      success: false,
      error: "email and password are required",
    });
  }

  if (!firstName || !lastName) {
    return response.status(400).json({
      success: false,
      error: "firstname and lastname are required",
    });
  }

  if (!phone || phone.length !== 10) {
    return response.status(400).json({
      success: false,
      error: "phone number must be 10 characters long",
    });
  }

  if (!zone || !routerID || !address) {
    return response.status(400).json({
      success: false,
      error: "zone, routerid and address are required",
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email: email }, { phone: phone }, { routerID: routerID }],
  });

  if (existingUser) {
    return response.status(400).json({
      success: false,
      error:
        "A user with the same email, phone number or router ID already exist",
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password: passwordHash,
      zone,
      routerID,
      address,
    });

    await user.save();

    //TODO: Send onboarding email
    response.status(200).json({ message: "User created Successfully" });
  } catch (error) {
    logger.error(error);
    response.status(500).json({ message: "Internal server error" });
  }
});

// Delete all users
router.delete("/", async (request, response) => {
  await User.deleteMany({});
  response.status(204).end();
});

router.delete("/", async (request, response) => {
  try {
    let { ids } = request.body;

    if (!ids) {
      return response.status(400).json({ error: "missing ids" });
    }

    if (!Array.isArray(ids)) {
      ids = [ids];
    }

    await Product.updateMany(
      { _id: { $in: ids } },
      { $set: { status: "deleted" } },
    );
    response.status(204).end();
  } catch (error) {
    console.log(error);
    response.status(400).json({ error: error.message });
  }
});

// Delete a user
router.delete("/:id", async (request, response) => {
  try {
    await User.findByIdAndRemove(request.params.id);
    response.status(204).json({ message: "User deleted successfully" });
  } catch {
    response.status(400).json({ error: "malformatted id" });
  }
});

// Update a user info
router.patch("/:id", async (request, response) => {
  const body = request.body;

  //TODO: Rehash the password if changed

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

module.exports = router;
