import {
  emailVerificationHtml,
  resetPasswordHtml,
  sendDeliveredOtpHtmlContent,
  welcomeEmailHtml,
} from "./htmlEmail.js";
import transporter from "./nodemailer.js";

const FROM_EMAIL = process.env.MAIL_ID;

export const sendOtpOnEmail = async (email, otp) => {
  const html = resetPasswordHtml.replace("{resetToken}", otp);

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: "Reset your Password",
      html,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send Reset your Password");
  }
};

export const sendOtpForEmailVerification = async (email, otp) => {
  const html = emailVerificationHtml.replace("{verificationCode}", otp);

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: "Email Verification",
      html,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send email verification");
  }
};

export const sendWelcom = async (email, fullName) => {
  const html = welcomeEmailHtml(fullName);

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: "Welcome back to Foodingo!",
      html,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send Welcome");
  }
};

export const sendDeliveredOtp = async (email, otp) => {
  const html = sendDeliveredOtpHtmlContent.replace("{deliveryOtp}", otp);

  try {
    await transporter.sendMail({
      from: FROM_EMAIL,
      to: email,
      subject: "Confirm Your Foodingo Delivery",
      html,
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send Delivery OTP");
  }
};
