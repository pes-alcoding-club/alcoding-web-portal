var jwt = require('jsonwebtoken');
const UserSession = require('../models/UserSession')
var privateKey = "mySecret";

function verifyToken(req, res, next) {
  // var token = req.headers['x-access-token']; this is for express headers, not tested
  var token = req.headers['authorization'].split(' ')[1]; // normal headers "Authorization: Bearer 2kj234df0ds2f3n40n"
  if (!token)
    return res.status(403).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, privateKey, function (err, decoded) {
    if (err) {
      if (err.name == "TokenExpiredError") {
        console.log("Deleting token from db.")
        // delete token from UserSession
        UserSession.findOneAndRemove({
          token: token
        }, (err) => {
          if (err) {
            return res.status(500).send({
              success: false,
              message: "Error: Server error"
            });
          }
        });
      }
      return res.status(401).send({ auth: false, err });
    }
    // save to request for use in other routes
    req.user_id = decoded.user_id;
    req.token = token;
    // Check log in status
    UserSession.findOne({
      token: token
    }, null, (err, session) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: "Error: Server error"
        });
      }
      if (!session) {
        return res.status(401).send({
          success: false,
          message: "Error: Invalid token."
        });
      }
      // Condition executed if non-admin
      if (req.params.userID != req.user_id) {
        return res.status(403).send({
          success: false,
          message: 'Error: Forbidden request.'
        });
      }
      next();
    });
  });
}

module.exports = verifyToken;