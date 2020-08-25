require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const PORT = process.env.PORT || 6000;

const apiRoutes = require("./app/routes");
const redis = require("./redisInstance");

redis.client.on("error", function (error) {
  console.log("An error occurred with redis:" + error);
});

const app = express();
app.use(cookieParser());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(function (req, res, next) {
  const allowedOrigins = [process.env.ALLOWED_ORIGIN, "http://localhost:3000"];
  const origin = req.headers.origin;
  if (allowedOrigins.indexOf(origin) > -1) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, cookie"
  );
  res.header("Access-Control-Allow-Credentials", true);
  res.header("Access-Control-Expose-Headers", "Set-Cookie");
  next();
});

app.use("/", apiRoutes);

mongoose.Promise = require("bluebird");

mongoose.set("useCreateIndex", true);
mongoose
  .connect(process.env.MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    server = app.listen(PORT, () => {
      console.log(`listening on: http://localhost:${PORT}`);
    });
  });

mongoose.connection.on("error", () => {
  throw new Error(`unable to connect to database: ${process.env.MONGOURI}`);
});
