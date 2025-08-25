var express = require('express');
var router = express.Router();

const User = require('../models/users');

const bcrypt = require('bcrypt');

const { checkBody } = require('../modules/checkbody');
const { generateToken } = require('../modules/generateToken')

router.post("/register", async (req, res) => {

  if (!checkBody(req.body, ["email", "password"])) {
    return res.json({ result: false, error: "Missing or empty fields" });
  }

  // Check if the user has not already been registered
  const userExist = await User.findOne({ email: req.body.email });
  if (userExist) {
    return res.json({ result: false, error: "User already exists" });
  }

  // Create new User
  const hash = bcrypt.hashSync(req.body.password, 10);

  const newUser = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: hash,
    company: req.body.company,
  });

  await newUser.save();

  // Generate jwt
  const token = generateToken(newUser);

  // Convert document to plain JS object
  const userObj = newUser.toObject();

  // Remove password field with destructuring
  const { password, ...userObjWithoutPassword } = userObj;

  return res.json({ result: true, data: { ...userObjWithoutPassword, token } });
});

router.post('/login', async (req, res) => {
  try {

    if (!checkBody(req.body, ["email", "password"])) {
      return res.json({ result: false, error: "Missing or empty fields" });
    }

    const user = await User.findOne({ email: req.body.email });

    
    // User not found
    if (!user) {
      return res.json({ result: false, error: "User not found" });
    }
    
    // Incorrect Password
    if (!bcrypt.compareSync(req.body.password, user.password)) {
      return res.json({ result: false, error: "Incorrect password" });
    }
    
    // Generate jwt
    const token = generateToken(user);

    // Convert document to plain JS object
    const userObj = user.toObject();

    // Remove password field with destructuring
    const { password, ...userObjWithoutPassword } = userObj;

    return res.json({
      result: true,
      data: { ...userObjWithoutPassword, token },
    });
    
  } catch (error) {
    res.send(error)
  }
  
});

router.get('/', async (req,res)=>{
  const user = await User.find();
  if (!user[0]) return console.log(user);
  res.json({reuslt:true, user});
})
module.exports = router;
