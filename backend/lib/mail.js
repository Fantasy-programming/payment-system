const logger = require("./logger");
const nodemailer = require("nodemailer");

/*
 * Send email to users
 * @param {String} email - Email address of the user
 * @param {String} title - Title of the email
 * @param {String} body - Body of the email
 * @returns {Promise} - Promise of the email sent
 * @throws {Error} - Throws error if email is not sent
 * */
async function sendMail(email, title, body) {
  try {
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        type: "OAuth2",
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
        clientId: process.env.MAIL_CLIENTID,
        clientSecret: process.env.MAIL_CLIENT_SECRET,
        refreshToken: process.env.MAIL_REFRESH_TOKEN,
      },
    });

    // Send emails to users
    let info = await transporter.sendMail({
      from: "Mikronet - Reception",
      to: email,
      subject: title,
      html: body,
    });

    logger.info("Email info: ", info);
    return info;
  } catch (error) {
    logger.error(error.message);
  }
}

module.exports = sendMail;
