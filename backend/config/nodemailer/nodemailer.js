import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

console.log(process.env.MAIL_PASS)

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_ID,
    pass: process.env.MAIL_PASS
  }
});

export default transporter;