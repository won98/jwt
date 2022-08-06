const express = require("express");
//const { createToken, creatRefreshToken } = require("../utils/jwt");
const { UserController: controller } = require("../controller");
const { verifyToken } = require("../middlewares/isAuth");
const { checkTokens } = require("../middlewares/isRefresh");
//const { checkToken } = require("../middleware/isAuth");
//const jwt = require("jsonwebtoken");
//const { authUtil } = require("../middleware/authJWT");
//const { Users } = require("../models");
const router = express.Router();

router.post("/signup", controller.Signup);
router.post("/login", controller.Login);
router.get("/inf", verifyToken);
router.post("/token", controller.IssueToken);
router.post("/new", checkTokens);
module.exports = router;
