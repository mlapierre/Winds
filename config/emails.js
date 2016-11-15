module.exports = {
    emails: {
        backend: 'smtp',
		provider: {
			service: 'gmail', // Use's nodemailer's pre-configured settings
		    auth: { 
		      user: process.env.EMAIL_USERNAME, 
		      pass: process.env.EMAIL_PASSWORD, 
		    }
		}
    }
}
