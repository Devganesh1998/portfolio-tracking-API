const redis = require("../../redisInstance");
let jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const smallcaseSessionId = req.cookies.smallcaseSessionId;

  if (smallcaseSessionId === null || smallcaseSessionId === undefined) {
    res.send({
      msg: "Session Expired Login Again",
      isAuthenticated: false,
    });
  } else {
    redis.client.get(smallcaseSessionId, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ "Internal Server Error": err });
      } else {
        if (result === null) {
          res.send({
            isAuthenticated: false,
            msg: "please login / register to access this endpoint",
          });
        }
        const parsedJwt = jwt.decode(result);
        if (parsedJwt === null || parsedJwt === undefined) {
          res.send({
            isAuthenticated: false,
            msg: "please login / register to access this endpoint",
          });
        } else {
          const { name, email } = parsedJwt;
          req.user = { name: name, email: email };
          next();
        }
      }
    });
  }
};
