// import dotenv from 'dotenv';
// import nodemailer from 'nodemailer';

// dotenv.config();

// console.log(process.env.MAIL_PASS)

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.MAIL_ID,
//     pass: process.env.MAIL_PASS
//   }
// });

// export default transporter;
import dotenv from "dotenv";
dotenv.config();

import { Resend } from "resend";

console.log("Resend API Key:", process.env.RESEND_API_KEY);

export const resend = new Resend(process.env.RESEND_API_KEY);
