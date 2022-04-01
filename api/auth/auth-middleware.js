const Users = require('../users/users-model');

function validateUser(req, res, next) {
    if(typeof req.body.username != 'string' || !req.body.username.trim()) {
        next({  status: 400, message: "username and password required" });
    } else if(typeof req.body.password != 'string' || !req.body.password) {
        next({  status: 400, message: "username and password required" });
    } else {
        req.user = {
            username: req.body.username.trim(),
            password: req.body.password,
        };
        next();
    }
}

async function validateUserNotExists(req, res, next) {
    let [user] = await Users.findBy({ username: req.body.username });
    if(user != null) {
        next({  status: 400, message: "username taken" });
    } else {
        next();
    }
}



module.exports = {
    validateUser,
    validateUserNotExists
}