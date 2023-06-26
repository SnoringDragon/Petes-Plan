const nodeMailer = require('nodemailer');
const handlebars = require('nodemailer-express-handlebars');
require('dotenv').config();

/* Create a transporter for sending emails to test server*/
const test_mailer = nodeMailer.createTransport({
    host: process.env.MAILHOG_HOST,
    port: process.env.MAILHOG_PORT,
});

/* Create a transporter for sending emails to production server*/
const prod_mailer = nodeMailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
});

/* Set up the email template */
const handlebarsOptions = {
    viewEngine: {
        extName: '.hbs',
        partialsDir: './emails/',
        defaultLayout: false,
    },
    extName: '.hbs',
    viewPath: './emails/',
};
test_mailer.use('compile', handlebars(handlebarsOptions));
prod_mailer.use('compile', handlebars(handlebarsOptions));

/* Send an email using arguments */
exports.sendEmail = async (to, subject, template, context) => {
    /* Compose the email */
    const mailOptions = {
        from: process.env.MAIL_ADDRESS,
        to: to,
        subject: subject,
        template: template,
        context: context
    };

    /* Send the email */
    if (process.env.MAIL_MODE === 'test') { // If in test mode, send to test SMTP server
        test_mailer.sendMail(mailOptions, (error) => {
            if (error) {
                console.log(error);
                return false;
            } else return true;
        });
    } else if (process.env.MAIL_MODE === 'prod') { // If in production mode, send to production SMTP server
        prod_mailer.sendMail(mailOptions, (error) => {
            if (error) {
                console.log(error);
                return false;
            } else return true;
        });
    } else { // If MAIL_MODE is not set to test or prod, throw an error
        throw new Error('Invalid MAIL_MODE: ' + process.env.MAIL_MODE + ', must be test or prod');
    }
};
