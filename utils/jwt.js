const jwt = require("jsonwebtoken");
require("dotenv").config();
//const { Users } = require("../models");
const { ACCESS_KEY, REFRESH_KEY } = process.env;

const createToken = (user) => {
  //const { id } = req.body;
  const payload = {
    // createToken에 들어갈 payload
    id: user.id,
  };
  const token = jwt.sign(payload, ACCESS_KEY, {
    algorithm: "HS256",
    expiresIn: "1m",
  });
  return token;
};

const creatRefreshToken = () => {
  const retoken = jwt.sign({}, REFRESH_KEY, {
    algorithm: "HS256",
    expiresIn: "1d",
  });
  return retoken;
};
const issues = (token, res) => {
  return jwt.verify(token, REFRESH_KEY, (err, user) => {
    if (err) res.sendStatus(403);
    const key = this.access(user.id);
    return key;
  });
};

module.exports = { createToken, creatRefreshToken, issues };
