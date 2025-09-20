export const resetPasswordHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Foodingo - Reset Password</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #fff9f6;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 10px;
                border: 1px solid #ff4d2d20;
                box-shadow: 0 0 12px rgba(255, 77, 45, 0.1);
            }
            .header {
                text-align: center;
                padding: 25px 0;
                background-color: #ff4d2d;
                border-radius: 10px 10px 0 0;
            }
            .header h1 {
                margin: 0;
                color: #ffffff;
                font-size: 28px;
                font-weight: bold;
            }
            .content {
                padding: 25px;
                text-align: center;
            }
            .content h2 {
                color: #333333;
                margin-bottom: 10px;
            }
            .content p {
                color: #555555;
                font-size: 16px;
                line-height: 1.6;
            }
            .content .code {
                font-size: 26px;
                font-weight: bold;
                color: #ff4d2d;
                margin: 20px 0;
                padding: 12px;
                border: 2px dashed #ff4d2d;
                border-radius: 8px;
                background-color: #fff4f2;
                display: inline-block;
                letter-spacing: 4px;
            }
            .footer {
                text-align: center;
                padding: 20px;
                font-size: 14px;
                color: #999999;
                border-top: 1px solid #eeeeee;
                margin-top: 20px;
            }
            .footer a {
                color: #ff4d2d;
                text-decoration: none;
                font-weight: 600;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🍔 Foodingo</h1>
            </div>
            <div class="content">
                <h2>Password Reset Request</h2>
                <p>We received a request to reset your password for your Foodingo account.</p>
                <p>Please use the code below to reset your password:</p>
                <div class="code">{resetToken}</div>
                <p>If you did not request a password reset, please ignore this email. Your account is safe and opt expire in 5 min.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 Foodingo. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
`;


export const emailVerificationHtml = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Foodingo - Email Verification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #fff9f6;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 10px;
                border: 1px solid #ff4d2d20;
                box-shadow: 0 0 12px rgba(255, 77, 45, 0.1);
            }
            .header {
                text-align: center;
                padding: 25px 0;
                background-color: #ff4d2d;
                border-radius: 10px 10px 0 0;
            }
            .header h1 {
                margin: 0;
                color: #ffffff;
                font-size: 28px;
                font-weight: bold;
            }
            .content {
                padding: 25px;
                text-align: center;
            }
            .content h2 {
                color: #333333;
                margin-bottom: 10px;
            }
            .content p {
                color: #555555;
                font-size: 16px;
                line-height: 1.6;
            }
            .content .code {
                font-size: 26px;
                font-weight: bold;
                color: #ff4d2d;
                margin: 20px 0;
                padding: 12px;
                border: 2px dashed #ff4d2d;
                border-radius: 8px;
                background-color: #fff4f2;
                display: inline-block;
                letter-spacing: 4px;
            }
            .footer {
                text-align: center;
                padding: 20px;
                font-size: 14px;
                color: #999999;
                border-top: 1px solid #eeeeee;
                margin-top: 20px;
            }
            .footer a {
                color: #ff4d2d;
                text-decoration: none;
                font-weight: 600;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🍔 Foodingo</h1>
            </div>
            <div class="content">
                <h2>Email Verification</h2>
                <p>Thank you for signing up with Foodingo! To complete your registration, please verify your email address.</p>
                <p>Use the verification code below:</p>
                <div class="code">{verificationCode}</div>
                <p>This code will expire in <b>5 minutes</b>. If you didn’t create this account, you can safely ignore this email.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 Foodingo. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
`;


export const welcomeEmailHtml = (fullName) => `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Welcome to Foodingo</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #fff9f6;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 10px;
                border: 1px solid #ff4d2d20;
                box-shadow: 0 0 12px rgba(255, 77, 45, 0.1);
            }
            .header {
                text-align: center;
                padding: 25px 0;
                background-color: #ff4d2d;
                border-radius: 10px 10px 0 0;
            }
            .header h1 {
                margin: 0;
                color: #ffffff;
                font-size: 28px;
                font-weight: bold;
            }
            .content {
                padding: 25px;
                text-align: center;
            }
            .content h2 {
                color: #333333;
                margin-bottom: 15px;
            }
            .content p {
                color: #555555;
                font-size: 16px;
                line-height: 1.6;
            }
            .button {
                display: inline-block;
                margin-top: 20px;
                padding: 12px 24px;
                background-color: #ff4d2d;
                color: #ffffff;
                font-size: 16px;
                font-weight: bold;
                border-radius: 8px;
                text-decoration: none;
                transition: 0.3s;
            }
            .button:hover {
                background-color: #e63b1c;
            }
            .footer {
                text-align: center;
                padding: 20px;
                font-size: 14px;
                color: #999999;
                border-top: 1px solid #eeeeee;
                margin-top: 20px;
            }
            .footer a {
                color: #ff4d2d;
                text-decoration: none;
                font-weight: 600;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🍔 Foodingo</h1>
            </div>
            <div class="content">
                <h2>Welcome, ${fullName}!</h2>
                <p>We’re so excited to have you back at <b>Foodingo</b>. 🎉</p>
                <p>Start exploring delicious meals, order your favorites, and enjoy fast delivery at your doorstep.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 Foodingo. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
`;


export const sendDeliveredOtpHtmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Foodingo - Delivery Confirmation</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #fff9f6;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
                border-radius: 10px;
                border: 1px solid #ff4d2d20;
                box-shadow: 0 0 12px rgba(255, 77, 45, 0.1);
            }
            .header {
                text-align: center;
                padding: 25px 0;
                background-color: #ff4d2d;
                border-radius: 10px 10px 0 0;
            }
            .header h1 {
                margin: 0;
                color: #ffffff;
                font-size: 28px;
                font-weight: bold;
            }
            .content {
                padding: 25px;
                text-align: center;
            }
            .content h2 {
                color: #333333;
                margin-bottom: 10px;
            }
            .content p {
                color: #555555;
                font-size: 16px;
                line-height: 1.6;
            }
            .content .code {
                font-size: 26px;
                font-weight: bold;
                color: #ff4d2d;
                margin: 20px 0;
                padding: 12px;
                border: 2px dashed #ff4d2d;
                border-radius: 8px;
                background-color: #fff4f2;
                display: inline-block;
                letter-spacing: 4px;
            }
            .footer {
                text-align: center;
                padding: 20px;
                font-size: 14px;
                color: #999999;
                border-top: 1px solid #eeeeee;
                margin-top: 20px;
            }
            .footer a {
                color: #ff4d2d;
                text-decoration: none;
                font-weight: 600;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🍔 Foodingo</h1>
            </div>
            <div class="content">
                <h2>Delivery Confirmation</h2>
                <p>Your order has arrived! To confirm that you have received your delivery, please provide the OTP below to the delivery partner.</p>
                <div class="code">{deliveryOtp}</div>
                <p>This OTP is valid for <b>5 minutes</b>. Please do not share it with anyone except your Foodingo delivery partner.</p>
            </div>
            <div class="footer">
                <p>&copy; 2024 Foodingo. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
`;
