const nodemailer = require("nodemailer");
const { env }= require( "../config/env.js");
const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    service: env.email.service,
    auth: {
      user: env.email.user,
      pass: env.email.pass,
    },
  });

  await transporter.sendMail({
    from: env.email.from,
    to,
    subject,
    text,
    html,
  });
};

module.exports = sendEmail;
