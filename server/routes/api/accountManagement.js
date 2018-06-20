const User = require('../../models/User');
const UserSession = require('../../models/UserSession');
const mongoose = require('mongoose');

// TODO: Limit number of queries to these endpoints
// TODO: Async functionality

module.exports = (app) => {
  app.post('/api/account/signup', function (req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var password = req.body.password;
    var email = req.body.email.toLowerCase().trim();
    console.log('Request to signUp.');

    if (!firstName) {
      return res.status(422).send({
        success: false,
        message: 'Error: First name cannot be blank.'
      });
    }
    if (!email) {
      return res.status(422).send({
        success: false,
        message: 'Error: Email cannot be blank.'
      });
    }
    if (!password) {
      return res.status(422).send({
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
      return res.status(422).send({
        success: false,
        message: 'Error: Email cannot be blank.'
      });
    }
    if (!password) {
      return res.status(422).send({
        success: false,
        message: 'Error: Password cannot be blank.'
      });
    }

    User.find({
      email: email
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
      const userSession = new UserSession();
      userSession.userId = user._id;
      userSession.save((err, doc) => {
        if (err) {
          console.log(err);
          return res.status(500).send({
            success: false,
            message: 'Error: Server Error.'
          });
        }
        console.log(user._id + " session started.")
        return res.status(200).send({
          success: true,
          message: 'Valid sign in',
          token: doc._id
        });
      });
    });
  }), //end of sign in endpoint

  app.get('/api/account/logout', function (req, res) {
    // GET http://localhost:8080/api/account/logout?tokenID=5b27acd353f181147f09f341
    var token = req.query.tokenID;
    console.log("Token: " + token + " is requesting to logout.");

    if (!token) {
      return res.status(422).send({
        success: false,
        message: 'Error: Token parameter cannot be blank'
      });
    }
    UserSession.findOneAndUpdate({
      _id: mongoose.Types.ObjectId(token),
      isLoggedOut: false
    }, {
        $set: {
          isLoggedOut: true
        }
      }, null, (err, session) => {
        if (err) {
          return res.status(500).send({
            success: false,
            message: "Error: Server error"
          });
        }
        if (!session) {
          return res.status(400).send({
            success: false,
            message: "Error: Invalid"
          });
        }

        return res.status(200).send({
          success: true,
          message: 'User has been logged out'
        });
      });
  });//end of login endpoint

};
