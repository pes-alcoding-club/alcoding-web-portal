const User = require('../../models/User');
const UserSession = require('../../models/UserSession')
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
var verifyToken = require('../VerifyToken');
// var privateKey = fs.readFileSync('sslcert/server.key'); privateKey for jwt to encrpyt. Can be asymmetric as well.
var privateKey = "mySecret"; //Change in VerifyToken.js as well.

// TODO: Limit number of queries to these endpoints
// TODO: Async functionality
// TODO: Add CORS

module.exports = (app) => {
  app.post('/api/account/signup', function (req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var password = req.body.password;
    var email = req.body.email.toLowerCase().trim();
    console.log('Request to signUp.');

    if (!firstName) {
      return res.status(400).send({
        success: false,
        message: 'Error: First name cannot be blank.'
      });
    }
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

    // Steps:
    // 1. Verify email doesn't exist
    // 2. Save
    User.find({
      email: email
    }, (err, previousUsers) => {
      if (err) {
        return res.status(500).send({
          success: false,
          message: 'Error: Server find error'
        });
      } else if (previousUsers.length > 0) {
        return res.status(409).send({
          success: false,
          message: 'Error: Account already exists.'
        });
      }
      // Save the new user
      const newUser = new User();

      newUser.email = email;
      newUser.name.firstName = firstName;
      newUser.name.lastName = lastName;
      newUser.password = newUser.generateHash(password);

      newUser.save((err, user) => {
        if (err) {
          return res.status(500).send({
            success: false,
            message: 'Error: Server error'
          });
        }
        console.log(newUser._id + " Added to DB.")
        return res.status(200).send({
          success: true,
          message: 'Signed up'
        });
      });
    });
  }), // end of sign up endpoint

    app.post('/api/account/signin', function (req, res) {
      var password = req.body.password;
      var email = req.body.email.toLowerCase().trim();
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
        payload = { user_id: user._id };
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

    app.get('/api/account/:userID/logout', verifyToken, function (req, res) {
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

    app.get('/api/account/:userID/details', verifyToken, function (req, res) {
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
