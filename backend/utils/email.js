const nodemailer = require('nodemailer');

exports.sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: parseInt(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const mailOptions = {
    from: `"Ideanomics Hub" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    html
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};
