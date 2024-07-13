const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
const logger = require("../lib/logger");
const sms = require("../lib/sms");

const User = require("../models/User");
const TempUser = require("../models/TempUser");

router.post("/signup", async (request, response) => {
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

  // check if user already exists

  const existingUser = await User.findOne({
    $or: [{ email: email }, { phone: phone }],
  });

  if (existingUser) {
    return response.status(400).json({
      success: false,
      error: "A user with the same email or password already exist",
    });
  }

  // Generate the OTP (6 digits)
  const otp = Math.floor(100000 + Math.random() * 900000);

  const tempUser = new TempUser({
    firstName,
    lastName,
    email,
    phone,
    password,
    zone,
    routerID,
    address,
    emailToken: otp,
  });

  try {
    await tempUser.save();
    response.status(200).json({ message: "OTP sent to your email" });
  } catch (e) {
    logger.error(e.message);
    response.status(400).json({ error: e.message, success: false });
  }
});

//TODO: REFACTOR TO SUPPORT MOBILE LOGIN

router.post("/verify-otp", async (request, response) => {
  const { value, token, type } = request.body;

  if (!value || !token || !type) {
    return response.status(400).json({
      error: "invalid request, value, token and type are required",
    });
  }

  if (type === "email") {
    const temp = await TempUser.find({ email: value })
      .sort({ createdAt: -1 })
      .limit(1);

    if (temp.lenght === 0 || token !== temp[0].emailToken) {
      return response.status(400).json({ error: "OTP invalid or has expired" });
    }

    const passwordHash = await bcrypt.hash(temp[0].password, 10);

    try {
      const user = new User({
        firstName: temp[0].firstName,
        lastName: temp[0].lastName,
        email: email,
        phone: temp[0].phone,
        password: passwordHash,
        zone: temp[0].zone,
        routerID: temp[0].routerID,
        address: temp[0].address,
        emailVerified: true,
        role: temp[0].role,
      });

      await user.save();

      const userForToken = {
        email: user.email,
        id: user._id,
      };

      // Token expires in 1 hour 60s x 60s
      const jwtToken = jwt.sign(userForToken, process.env.SECRET, {
        expiresIn: 60 * 60,
      });

      response
        .status(200)
        .send({ token: jwtToken, email: user.email, role: user.role });
    } catch (error) {
      console.log(e);
      response.status(500).json({ message: "Internal server error" });
    }
  }

  if (type === "phone") {
    try {
      const res = await sms.verifyOTP({ code: token, number: value });
      if (res.code !== "1100") {
        return response
          .status(400)
          .json({ error: "OTP invalid or has expired", success: false });
      }

      const user = await User.findOne({ phone: value });

      console.log(user);

      const userForToken = {
        email: user.email,
        role: user.role,
        id: user._id,
      };

      const jwtToken = jwt.sign(userForToken, process.env.SECRET, {
        expiresIn: 60 * 60,
      });

      const payload = {
        email: user.email,
        role: user.role,
        token: jwtToken,
      };

      console.log(payload);

      return response
        .status(200)
        .send({ token: jwtToken, email: user.email, role: user.role });
    } catch (error) {
      console.log(error);
      return response.status(400).json({ error: "OTP invalid or has expired" });
    }
  }
});

router.post("/login", async (request, response) => {
  const { email, password } = request.body;

  const user = await User.findOne({ email });

  if (!user) {
    return response.status(401).json({
      error: "invalid email or password",
    });
  }

  if (password !== user.password) {
    return response.status(401).json({
      error: "invalid email or password",
    });
  }

  // const passwordCorrect =
  //   user === null ? false : await bcrypt.compare(password, user?.password);
  //
  // if (!(user && passwordCorrect)) {
  //   return response.status(401).json({
  //     error: "invalid email or password",
  //   });
  // }

  const userForToken = {
    email: user.email,
    role: user.role,
    id: user._id,
  };

  // Token expires in 1 hour 60s x 60s
  const token = jwt.sign(userForToken, process.env.SECRET, {
    expiresIn: 60 * 60,
  });

  response.status(200).send({ token, role: user.role, email: user.email });
});

router.post("/mobile", async (request, response) => {
  const { phone } = request.body;

  if (!phone) {
    return response
      .status(400)
      .json({ success: true, error: "invalid request, missing phone" });
  }

  const user = await User.findOne({ phone });

  if (!user) {
    return response.status(400).json({
      success: false,
      error: "No user with this phone number",
    });
  }

  try {
    const res = await sms.sendOTP({
      message: "Your otp is %otp_code%. It will expire in %expiry% minutes.",
      number: phone,
    });

    console.log(res);

    response
      .status(200)
      .json({ success: true, message: "Otp sent to phone number" });
  } catch (e) {
    console.log(e);
    response
      .status(500)
      .json({ success: false, message: "internal server error" });
  }
});

module.exports = router;
