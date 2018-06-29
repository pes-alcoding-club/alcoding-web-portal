const User = require('../../models/User');
var requireRole = require('../middleware/Token').requireRole;


module.exports = (app) => {
    app.post('/api/admin/signup', requireRole("admin"), function (req, res) {

        // TODO: Change Email to usn
        var firstName = req.body.firstName;
        var lastName = req.body.lastName;
        var password = req.body.password;
        var email = req.body.email;
        var usn = req.body.usn;
        var role = req.body.role;
        // console.log(req.body);

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
            newUser.usn = usn;
            newUser.password = newUser.generateHash(password);
            if (role && role != "admin") {
                // TODO: in the else part, throw an error "Cannot assign role 'admin' "
                newUser.role = role;
            }

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
    }); // end of sign up endpoint
}