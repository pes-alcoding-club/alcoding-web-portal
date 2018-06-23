var jwt = require('jsonwebtoken');
var privateKey = "mySecret";

function verifyToken(req, res, next) {
  // var token = req.headers['x-access-token']; this is for express headers, not tested
  var token = req.headers['authorization'].split(' ')[1]; // normal headers "Authorization: Bearer 2kj234df0ds2f3n40n"
  if (!token)
    return res.status(403).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, privateKey, function (err, decoded) {
    if (err)
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    // if everything good, save to request for use in other routes
    req.user_id = decoded.user_id;
    next();
  });
}

module.exports = verifyToken;