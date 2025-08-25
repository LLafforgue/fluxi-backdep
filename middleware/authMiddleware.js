require('dotenv').config()
const jwt = require("jsonwebtoken");
const User = require("../models/users");

const JWT_SECRET = process.env.JWT_SECRET

exports.authMiddleware = async (req, res, next) => {
  try {
    const tokenString = req.headers.authorization;

    if (!tokenString) {
        return res.status(401).json({ message: "Token introuvable" });
    }
    
    const token = tokenString.split(" ")[1];
        
    // Verifie token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // decoded.id contains user._id
    const user = await User.findById(decoded.id);


    if (!user) {
      return res.status(401).json({ message: "Utilisateur introuvable" });
    }

    // Add user to req obj
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalide ou expiré" });
  }
};
