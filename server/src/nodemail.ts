import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: Bun.env.NODE_MAIL_USER,
    pass: Bun.env.NODE_MAIL_PASS,
  },
});

export default transporter;
