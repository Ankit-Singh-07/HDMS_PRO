const nodemailer = require("nodemailer");

const sendEmail = async (to, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Gmail App Password
    },
  });

  await transporter.sendMail({
    from: `"HDMS Security" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP for Doctor Registration",
    html: `
      <h2>HDMS Verification Code</h2>
      <p>Your OTP is:</p>
      <h1 style="letter-spacing:5px;">${otp}</h1>
      <p>This OTP is valid for 5 minutes.</p>
    `,
  });
};

module.exports = sendEmail;
