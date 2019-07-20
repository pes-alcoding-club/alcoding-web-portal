const nodemailer = require("nodemailer");
const auth = require("./mailCredentialsSample");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth
});

// let mailTemplate=fs.readFileSync("forgotPassword.txt","utf8");

const sendMail = (emailId, subject, text) => {
	const mailOptions = {
		from: auth.user,
		to: emailId,
		subject,
		text
	};
	return new Promise((resolve, reject) => {		
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
				reject({success:false, message:error});
			} else {
				console.log('Email sent: ' + info.response);
				resolve();
			}
		});
	})  	
}

const sendPasswordResetMail = (userEmail, username, resetLink) => {
	const mailOptions = {
		from: auth.user,
		to: userEmail,
		subject: '[The Alcoding Club] Password Reset',
		text: `Hello ${username}, please reset password here: ${resetLink}`
	};
	return new Promise((resolve, reject) => {		
		transporter.sendMail(mailOptions, function (error, info) {
			if (error) {
				console.log(error);
				reject({success:false, message:error});
			} else {
				console.log('Email sent: ' + info.response);
				resolve();
			}
		});
	})	
}

module.exports = {
	sendMail,
	sendPasswordResetMail
} 

