const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const cors = require("cors");
const jwt = require("jsonwebtoken");
//const { createToken } = require("./utils/jwt");
//const { Users } = require("./models");
const compression = require("compression");
const helmet = require("helmet");
//const bodyParser = require("body-parser");
const { sequelize } = require("./models");
const Router = require("./routes");

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("OK");
  })
  .catch((err) => {
    console.log(err);
  });
app.use(express.json());
//app.use(bodyParser.json());
app.use(cors());
app.use(compression());
app.use(helmet());
app.use("/img", express.static("./uploads"));

app.use("/user", Router.UserRoute);

// const authenticateAccessToken = (req, res, next) => {
//   let authHeader = req.headers["authorization"];
//   let token = authHeader && authHeader.split(" ")[1];

//   if (!token) {
//     console.log("wrong token format or token is not sended");
//     return res.sendStatus(400);
//   }

//   jwt.verify(token, process.env.ACCESS_KEY, (error, user) => {
//     if (error) {
//       console.log(error);
//       return res.sendStatus(404);
//     }

//     req.user = user;
//     next();
//   });
// };
// app.get("/user", createToken, (req, res) => {
//   console.log(req.user);
//   res.json(user.filter((user) => user.id === req.user.id));
// });
// app.post("/refresh", (req, res) => {
//   let refreshToken = req.body.refreshToken;
//   if (!refreshToken) return res.sendStatus(401);

//   jwt.verify(refreshToken, process.env.REFRESH_KEY, (error, user) => {
//     if (error) return res.sendStatus(404);

//     const accessToken = generateAccessToken(user.id);

//     res.json({ accessToken });
//   });
// });

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
