const nodemailer = require("nodemailer");
const auth = require("./mailCredentialsSample");
const fs = require("fs");

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth
});


const sendMail = (emailId, subject, text, html = null) => {
	// If no template passed, only text shall be used by nodemailer.
	const mailOptions = {
		from: auth.user,
		to: emailId,
		subject,
		text,
		html
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
	const subject =  '[The Alcoding Club] Password Reset';
	const text =  `Hello ${username}, please reset password here: ${resetLink}`;	
	let mailTemplate = fs.readFileSync("server/sendEmail/emailTemplates/forgotPassword.txt","utf8");
	mailTemplate = mailTemplate.replace("{{username}}", username);
	mailTemplate = mailTemplate.replace("{{link}}", resetLink);

	return new Promise((resolve, reject) => {		
		sendMail(userEmail, subject, text, mailTemplate)
			.then(() =>{
				resolve();				
			})
			.catch((err) => {
				reject(err);				
			})
	})	
}

module.exports = {
	sendMail,
	sendPasswordResetMail
} 

