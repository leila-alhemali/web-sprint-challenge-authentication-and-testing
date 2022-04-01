const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const router = require('express').Router();
const User = require('../users/users-model.js')

const { BCRYPT_ROUNDS, JWT_SECRET } = require('../../config');
const { validateUser, validateUserNotExists} = require('./auth-middleware.js');


router.post('/register', validateUser, validateUserNotExists, (req, res, next) => {

      let user = req.body
      const hash = bcrypt.hashSync(user.password, BCRYPT_ROUNDS)
      user.password = hash

      User.add(user)
        .then(saved => {
          res.status(201).json({ ...saved })
        })
        .catch(next)
});

router.post('/login', validateUser, (req, res, next) => {
  let { username, password } = req.body
  /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */

      User.findBy({ username })
      .then(([user]) => {
        if (user && bcrypt.compareSync(password, user.password)) {
          const token = generateToken(user);
          res.status(200).json({
            message: `Welcome back ${user.username}...`,
            token,
          })
        } else {
          next({ status: 401, message: 'Invalid Credentials' })
        }
      })
      .catch(next)
  });

  function generateToken(user) {
    const payload = {
      subject: user.id,
      username: user.username,
    };
    const options = {
      expiresIn: '1d',
    };
    return jwt.sign(payload, JWT_SECRET, options);
  }

module.exports = router;
