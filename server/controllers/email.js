const nodeMailer = require('nodemailer');

/* Create a transporter for sending emails */
const mailer = nodeMailer.createTransport({
    /* Uncomment the following lines and comment previous 2 lines to use a fake email service */
    
    host: '127.0.0.1',
    port: 1025,
    
    /* Uncomment the following lines and comment previous 2 lines to use a real email service */
    /*
    service: 'SendGrid',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
    */
});

/* Send an email using arguments */
exports.sendEmail = async (to, subject, html) => {
    /* Compose the email */
    const mailOptions = {
        from: process.env.MAIL_ADDRESS,
        to: to,
        subject: subject,
        html: html
    };

    /* Send the email */
    try {
        await mailer.sendMail(mailOptions);
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};
