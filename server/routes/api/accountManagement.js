const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
const jwt = require('jsonwebtoken');
var verifyUser = require('../../middleware/Token').verifyUser;
const readFileSync = require('fs').readFileSync;
var privateKey = readFileSync('server/sslcert/server.key', 'utf8'); //privatekey for jwt

// TODO: Limit number of queries to these endpoints
// TODO: Async functionality
// TODO: Add CORS
// TODO: Change logout to POST as it isn't idempotent

module.exports = (app) => {
    app.post('/api/account/signin', function (req, res) {
      var password = '' + req.body.password;
      var email = ('' + req.body.email).toLowerCase().trim();
      console.log("Email: " + email + " attempting to signIn.");

      if (!email) {
        return res.status(400).send({
          success: false,
          message: 'Error: Email cannot be blank.'
        });
      }
      if (!password) {
        return res.status(400).send({
          success: false,
          message: 'Error: Password cannot be blank.'
        });
      }

      User.find({
        email: email,
        isDeleted: false
      }, (err, users) => {
        if (err) {
          console.log('err 2:', err);
          return res.status(500).send({
            success: false,
            message: 'Error: Server Error.'
          });
        }
        if (users.length != 1) {
          return res.status(401).send({
            success: false,
            message: 'Error: Invalid'
          });
        }

        const user = users[0];
        if (!user.checkPassword(password)) {
          return res.status(401).send({
            success: false,
            message: 'Error: Invalid credentials.'
          });
        }

        // Otherwise correct user
        payload = { user_id: user._id, role: user.role };
        jwt.sign(payload, privateKey, { expiresIn: "2d" }, (err, token) => {
          if (err) {
            console.log(err);
            return res.status(500).send({
              success: false,
              message: 'Error: Server Error.'
            });
          }

          newSession = new UserSession();
          newSession.token = token;
          newSession.save((err, session) => {
            if (err) {
              return res.status(500).send({
                success: false,
                message: 'Error: Server error'
              });
            }
            console.log("JWT generated.");
            return res.status(200).send({
              success: true,
              message: 'Valid sign in',
              user_id: payload.user_id,
              token: token
            });
          });
        });
      });
    }), //end of sign in endpoint

    app.get('/api/account/:userID/logout', verifyUser, function (req, res) {
      // GET http://localhost:8080/api/account/:userID/logout
      var user_id = req.params.userID;

      if (!user_id) {
        return res.status(400).send({
          success: false,
          message: 'Error: UserID parameter cannot be blank'
        });
      }

      UserSession.findOneAndRemove({
        token: req.token
      }, (err, session) => {
        if (err) {
          return res.status(500).send({
            success: false,
            message: "Error: Server error"
          });
        }
        if (!session) {
          return res.status(400).send({
            success: false,
            message: "Error: Invalid."
          });
        }

        return res.status(200).send({
          success: true,
          message: 'User has been logged out'
        });
      });
    }), //end of logout endpoint

    app.get('/api/account/:userID/details', verifyUser, function (req, res) {
      // GET http://localhost:8080/api/account/:userID/details
      var user_id = req.params.userID;

      //Verify that userID is present as a parameter
      if (!user_id) {
        return res.status(400).send({
          success: false,
          message: 'Error: userID parameter cannot be blank'
        });
      }

      console.log("Request to access details of " + user_id);
      // Search for the user in the User model with his user_id
      User.find({
        _id: user_id
      }, (err, users) => {
        if (err) {
          return res.status(500).send({
            success: false,
            message: "Error: Server error"
          });
        }

        if (users.length != 1) {
          return res.status(404).send({
            success: false,
            message: 'Error: User not found.'
          });
        }
        var user = users[0].toObject();
        delete user.password;
        delete user.isDeleted;
        delete user.__v;

        // Return a response with user data
        return res.status(200).send({
          success: true,
          message: "Details successfully retrieved",
          user: user
        });
      });
    }); //end of getDetails endpoint
};
