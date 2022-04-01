
const jwt  = require('jsonwebtoken');
const { JWT_SECRET } = require('../../config');

const User = require('../users/users-model');

module.exports = (req, res, next) => {
  const token = req.headers.authorization;
  console.log(token)
  if(token) {
    jwt.verify(token, JWT_SECRET, (err, decodedJwt) => {
      if(err) {
        next({ status: 401, message: "token required" });
      } else {
        User.findById(decodedJwt.subject)
          .then(user => {
            if(user.logged_out_time > decodedJwt.iat) {
              next({ status: 401, message: "token invalid" });
            } else {
              console.log(decodedJwt);
              req.decodedJwt = decodedJwt;
              next();
            }
          });
      }
    })
  } else {
    next({ status: 401, message: 'this endpoint is restricted!' });
  }
  /*
    IMPLEMENT

    1- On valid token in the Authorization header, call next.

    2- On missing token in the Authorization header,
      the response body should include a string exactly as follows: "token required".

    3- On invalid or expired token in the Authorization header,
      the response body should include a string exactly as follows: "token invalid".
  */
};
