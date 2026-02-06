const nodeMailer = require('nodemailer');
const handlebars = require('nodemailer-express-handlebars');

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
mailer.use('compile', handlebars(handlebarsOptions));

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
    await mailer.sendMail(mailOptions, (error) => {
        if (error) {
            console.log(error);
            return false;
        } else return true;
    });
};
