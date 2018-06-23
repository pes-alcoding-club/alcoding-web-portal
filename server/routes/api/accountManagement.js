const User = require('../../models/User');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
var verifyToken = require('../VerifyToken');
// var privateKey = fs.readFileSync('sslcert/server.key'); privateKey for jwt to encrpyt. Can be asymmetric as well.
var privateKey = "mySecret";

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
      console.log("Email: " + "attempting to signIn.");

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
          return res.status(400).send({
            success: false,
            message: 'Error: Invalid'
          });
        }

        const user = users[0];
        if (!user.checkPassword(password)) {
          return res.status(400).send({
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
          console.log("JWT generated.");
          return res.status(200).send({
            success: true,
            message: 'Valid sign in',
            user_id: payload.user_id,
            token: token
          });
        });
      });
    }), //end of sign in endpoint

    app.get('/api/account/logout', verifyToken, function (req, res) {
      // GET http://localhost:8080/api/account/logout?userID=5b27acd353f181147f09f341
      var user_id = req.query.userID;

      if (!user_id) {
        return res.status(400).send({
          success: false,
          message: 'Error: UserID parameter cannot be blank'
        });
      }

      console.log(user_id + " is requesting to logout.");
      // Condition executed if non-admin
      if (user_id != req.user_id)
      {
        return res.status(403).send({
          success: false,
          message: 'Error: Forbidden request.'
        });
      }

      return res.status(200).send({
        success: true,
        message: 'User has been logged out',
        token: ''
      });
    }), //end of logout endpoint

    app.get('/api/account/getDetails', verifyToken, function (req, res) {
      // GET http://localhost:8080/api/account/getDetails?userID=5b2bdcfd1f584e0270058705
      var user_id = req.query.userID;

      //Verify that token is present
      if (!token) {
        return res.status(400).send({
          success: false,
          message: 'Error: Token parameter cannot be blank'
        });
      }

      console.log("Request to access details of " + user_id);
      // Condition executed if non-admin
      if (user_id != req.user_id) //Condition for non-admins.
      {
        return res.status(403).send({
          success: false,
          message: 'Error: Forbidden request.'
        });
      }

      // Search for the user in the User model with his userId
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
        var user = users[0];

        // Return a response with user data
        return res.status(200).send({
          success: true,
          message: "User: " + user._id + " details successfully retrieved",
          user: user
        });
      });
    });
};
