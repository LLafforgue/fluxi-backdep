require('dotenv').config()
const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

function generateToken(user) {
  // Generate token
  // payload user._id
  // signed with secret
  return jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "12h" });
}

module.exports = { generateToken };
