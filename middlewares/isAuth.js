const jwt = require("jsonwebtoken");
//const { createToken } = require("../utils/jwt");
require("dotenv").config();
const secretKey = "" + process.env.ACCESS_KEY;
const { Users } = require("../models");

module.exports = {
  verifyToken: async (req, res, next) => {
    try {
      const token = req.headers.authorization.split("Bearer ")[1];
      console.log(token);
      const decodedToken = jwt.verify(token, secretKey);
      console.log(decodedToken);
      const { id } = decodedToken;
      console.log(id);
      const rows = await Users.findOne({
        where: { id: id },
      });
      if (rows) {
        return res.status(200).json({ result: decodedToken });
      } else {
        console.log(err);
      }
      next();
    } catch (err) {
      console.log(err);
    }
  },
  verifyRefreshToken: (token) => {
    if (!token) {
      return "";
    }
    let decoded = jwt.verify(token, REFRESH_KEY);
    return decoded;
  },
};
// const { verify } = require("../util/jwt");

// const authJWT = (req, res, next) => {
//   if (req.headers.authorization) {
//     const token = req.headers.authorization.split("Bearer ")[1]; // header에서 access token을 가져옵니다.
//     const result = verify(token); // token을 검증합니다.
//     if (result.ok) {
//       // token이 검증되었으면 req에 값을 세팅하고, 다음 콜백함수로 갑니다.
//       req.id = result.id;
//       req.role = result.role;
//       next();
//     } else {
//       // 검증에 실패하거나 토큰이 만료되었다면 클라이언트에게 메세지를 담아서 응답합니다.
//       res.status(401).send({
//         ok: false,
//         message: result.message, // jwt가 만료되었다면 메세지는 'jwt expired'입니다.
//       });
//     }
//   }
// };

// module.exports = authJWT;
