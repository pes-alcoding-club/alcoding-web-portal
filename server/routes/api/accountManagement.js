const User = require('../../models/User');
const UserSession = require('../../models/UserSession');

module.exports = (app) => {
  app.post('/api/account/signup', function (req, res) {
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var password = req.body.password;
    console.log(firstName);
    console.log(lastName);
    var email = req.body.email.toLowerCase().trim();

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
      console.log(firstName);
      console.log(lastName);
      var email = req.body.email.toLowerCase().trim();

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

        console.log('here');
        
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
    });
};
