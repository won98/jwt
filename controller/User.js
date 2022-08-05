const { Users } = require("../models");
const { createToken, creatRefreshToken } = require("../utils/jwt");
const bcrypt = require("bcrypt");
const jwt = require("../utils/jwt");
const { ACCESS_KEY, REFRESH_KEY } = process.env;
require("dotenv").config();

module.exports = {
  Signup: async (req, res) => {
    try {
      let { id, passwd } = req.body;
      const hash = await bcrypt.hash(passwd, 10);
      const rows = await Users.create({
        id: id,
        passwd: hash,
      });
      if (rows) return res.status(200).json({ result: rows });
    } catch (err) {
      console.log(err);
    }
  },
  Login: async (req, res) => {
    try {
      const { id, passwd } = req.body;
      const user = await Users.findOne({
        where: { id: id },
      });
      const compare = await bcrypt.compare(passwd, user.passwd);
      // const payload = {
      //   // json web token 으로 변환할 데이터 정보
      //   user: {
      //     id: user.id,
      //   },
      // };
      // // json web token 생성하여 send 해주기
      // jwt.sign(
      //   payload, // 변환할 데이터
      //   ACCESS_KEY, // secret key 값
      //   { expiresIn: "1h" }, // token의 유효시간
      //   (err, token) => {
      //     if (err) throw err;
      //     res.send({ token }); // token 값 response 해주기
      //   }
      // );
      if (compare == true) {
        //const token = createToken(Users.id);
        const token = createToken(user);
        const retoken = creatRefreshToken(Users.id);
        res.send({ token, retoken });
      } else {
        throw res.send(err);
      }
    } catch (err) {
      console.log(err);
    }
  },
};
