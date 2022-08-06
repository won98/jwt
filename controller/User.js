const { Users } = require("../models");
const { createToken, creatRefreshToken } = require("../utils/jwt");
const bcrypt = require("bcrypt");
const jwt = require("../utils/jwt");
const shortid = require("shortid");
const { ACCESS_KEY, REFRESH_KEY } = process.env;
require("dotenv").config();

module.exports = {
  Signup: async (req, res) => {
    try {
      let { id, passwd } = req.body;
      const hash = await bcrypt.hash(passwd, 10);
      const beforeId = shortid.generate();
      let token = jwt.createToken({
        user_id: id.toString(),
        id: beforeId.toString(),
      });
      let rtoken = jwt.creatRefreshToken({
        id: beforeId.toString(),
      });
      const rows = await Users.create({
        id: id,
        passwd: hash,
        refreshtoken: rtoken,
      });
      if (rows)
        return res
          .status(200)
          .json({ result: rows, xauth: token, rxauth: rtoken });
    } catch (err) {
      console.log(err);
    }
  },
  CheckId: async (req, res) => {
    try {
      // 일반 유저의 경우 아이디 중복체크
      let { id } = req.body;
      const rows = await Users.findOne({
        where: {
          id: id,
        },
      });
      if (rows) {
        return res.status(200).json({
          result: false,
        });
      } else {
        return res.status(200).json({
          result: true,
        });
      }
    } catch (error) {
      return res.status(200).send(errorHandler(error));
    }
  },
  Login: async (req, res) => {
    try {
      const { id, passwd } = req.body;
      let token;
      let rtoken;
      const rows = await Users.findOne({
        where: { id: id },
      });
      const compare = await bcrypt.compare(passwd, rows.passwd);

      if (compare == true) {
        //const token = createToken(Users.id);
        token = jwt.createToken({
          user_id: rows.id.toString(),
          id: rows.id.toString(),
        });
        rtoken = creatRefreshToken({ id: rows.id.toString() });
        return res.send({ token, rtoken });
      } else {
        throw res.send(err);
      }
    } catch (err) {
      console.log(err);
    }
  },
  IssueToken: async (req, res) => {
    try {
      let { rxauth } = req.headers;
      const issueId = jwt.verifyRefreshToken(rxauth);
      const isTrue = await Users.findOne({
        where: {
          id: issueId.user_id,
          refreshtoken: rxauth,
        },
      });
      if (!isTrue) {
        return res.status(200).json({ result: "failed" });
      }
      let token = jwt.createToken({
        user_id: isTrue.oauthid.toString(),
        id: isTrue.id.toString(),
      });
      return res.status(200).json({
        xauth: token,
      });
    } catch (err) {
      console.log(err);
    }
  },
};
