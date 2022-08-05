// const jwt = require("jsonwebtoken");
// const { createToken } = require("../utils/jwt");
// const rsecretKey = "" + process.env.R_ACCESS_KEY;
//const db = require("../db/db");

// const createToken = (payload) => {
//   console.log("createToken");
//   const token = jwt.sign({ name: payload.toString() }, secretKey, {
//     algorithm: "HS256",
//     expiresIn: "30m",
//   });
//   return token;
// };

// module.exports = {
//   Newtoken: async (req, res, next) => {
// if (req.headers.authorization && req.headers.refresh) {
//   const createToken = req.headers.authorization.split("Bearer ")[1];
//   const refreshToken = req.headers.refresh;

//   // access token 검증 -> expired여야 함.
//   const authResult = verify(createToken);

//   // access token 디코딩하여 user의 정보를 가져옵니다.
//   const decoded = jwt.decode(createToken);
//   if (decoded === null) {
//     res.status(401).send({
//       ok: false,
//       message: "No authorized!",
//     });
//   }
// }
//     try {
//       const refreshtoken = req.body;
//       console.log(refreshtoken);

//       if (!refreshtoken) {
//         return false;
//       }

//       const decodedToken = jwt.verify(refreshtoken, rsecretKey);
//       const { id } = decodedToken;

//       const rows = await Users.findOne({
//         where: { id: id },
//       });
//       if (rows) {
//         const newtoken = createToken(rows[0].id);
//         console.log(newtoken);
//         res.send({ newtoken });
//       } else {
//         return false;
//       }
//     } catch (err) {
//       next(err);
//     }
//   },
// };
// const { createToken, verify, refreshVerify } = require("../util/jwt-util");
// const jwt = require("jsonwebtoken");

// const refresh = async (req, res) => {
//   // access token과 refresh token의 존재 유무를 체크합니다.
//   if (req.headers.authorization && req.headers.refresh) {
//     const authToken = req.headers.authorization.split("Bearer ")[1];
//     const refreshToken = req.headers.refresh;

//     // access token 검증 -> expired여야 함.
//     const authResult = verify(authToken);

//     // access token 디코딩하여 user의 정보를 가져옵니다.
//     const decoded = jwt.decode(authToken);

//     // 디코딩 결과가 없으면 권한이 없음을 응답.
//     if (decoded === null) {
//       res.status(401).send({
//         ok: false,
//         message: "No authorized!",
//       });
//     }

//     /* access token의 decoding 된 값에서
//       유저의 id를 가져와 refresh token을 검증합니다. */
//     const refreshResult = refreshVerify(refreshToken, decoded.id);

//     // 재발급을 위해서는 access token이 만료되어 있어야합니다.
//     if (authResult.ok === false && authResult.message === "jwt expired") {
//       // 1. access token이 만료되고, refresh token도 만료 된 경우 => 새로 로그인해야합니다.
//       if (refreshResult.ok === false) {
//         res.status(401).send({
//           ok: false,
//           message: "No authorized!",
//         });
//       } else {
//         // 2. access token이 만료되고, refresh token은 만료되지 않은 경우 => 새로운 access token을 발급
//         const newAccessToken = createToken(user);

//         res.status(200).send({
//           // 새로 발급한 access token과 원래 있던 refresh token 모두 클라이언트에게 반환합니다.
//           ok: true,
//           data: {
//             accessToken: newAccessToken,
//             refreshToken,
//           },
//         });
//       }
//     } else {
//       // 3. access token이 만료되지 않은경우 => refresh 할 필요가 없습니다.
//       res.status(400).send({
//         ok: false,
//         message: "Acess token is not expired!",
//       });
//     }
//   } else {
//     // access token 또는 refresh token이 헤더에 없는 경우
//     res.status(400).send({
//       ok: false,
//       message: "Access token and refresh token are need for refresh!",
//     });
//   }
// };

// module.exports = refresh;

//main
const { verifyToken } = require("../middlewares/isAuth");
const jwt = require("jsonwebtoken");

module.exports = {
  async checkTokens(req, res, next) {
    /**
     * access token 자체가 없는 경우엔 에러(401)를 반환
     * 클라이언트측에선 401을 응답받으면 로그인 페이지로 이동시킴
     */
    if (req.headers === undefined) throw Error("API 사용 권한이 없습니다.");

    const accessToken = verifyToken(req.headers.access);
    const refreshToken = verifyToken(req.headers.refresh); // *실제로는 DB 조회

    if (accessToken === null) {
      if (refreshToken === undefined) {
        // case1: access token과 refresh token 모두가 만료된 경우
        throw Error("API 사용 권한이 없습니다.");
      } else {
        // case2: access token은 만료됐지만, refresh token은 유효한 경우
        /**
         *  DB를 조회해서 payload에 담을 값들을 가져오는 로직
         */
        const newAccessToken = jwt.sign(
          { userId, userName },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
            issuer: "cotak",
          }
        );
        res.cookie("access", newAccessToken);
        req.cookies.access = newAccessToken;
        next();
      }
    } else {
      if (refreshToken === undefined) {
        // case3: access token은 유효하지만, refresh token은 만료된 경우
        const newRefreshToken = jwt.sign({}, process.env.JWT_SECRET, {
          expiresIn: "14d",
          issuer: "cotak",
        });
        /**
         * DB에 새로 발급된 refresh token 삽입하는 로직 (login과 유사)
         */
        res.cookie("refresh", newRefreshToken);
        req.cookies.refresh = newRefreshToken;
        next();
      } else {
        // case4: accesss token과 refresh token 모두가 유효한 경우
        next();
      }
    }
  },
};
//main f
