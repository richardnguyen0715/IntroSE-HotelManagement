const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter using Mailtrap
  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS
    }
  });

  // Define email options
  const mailOptions = {
    from: `Hotel Management <noreply@hotelmanagement.com>`,
    to: options.email,
    subject: options.subject,
    text: options.message
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;