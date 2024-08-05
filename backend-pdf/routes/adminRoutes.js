const express  = require("express");
const { registerUser } = require("../controller/adminController");
const router = express.Router();


router.post("/register-user", registerUser)

module.exports = router