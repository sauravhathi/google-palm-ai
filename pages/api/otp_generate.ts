import nodemailer from "nodemailer";
import otpController from "./controllers/otpController";
import connectDB from "./db/config";
import { NextApiRequest, NextApiResponse } from "next";
import methodNotAllowed from "./utils/methodNotAllowed";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST") {
      return methodNotAllowed(res);
    }

    const { email } = req.body;
    const origin = req.headers.origin;

    const allowedOrigins =
      process.env.NODE_ENV === "development"
        ? process.env.DEV_ORIGINS?.split(",") || []
        : process.env.ALLOWED_ORIGINS?.split(",") || [];

    if (!allowedOrigins.includes(origin || "")) {
      return res.status(403).json({ error: "Forbidden" });
    }

    if (!email) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Check if email configuration is set
    if (!process.env.GMAIL_USER || !process.env.GMAIL_PASS) {
      return res.status(500).json({ error: "Email configuration missing" });
    }

    // Connect to the database
    await connectDB();

    // Generate OTP
    const otp = await otpController.generateOtp(email);

    // Send OTP email
    await sendOtpEmail(email, otp);

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message });
  }
}

async function sendOtpEmail(email: string, otp: number) {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Google Palm Ai" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Google Palm AI Access Key OTP",
      text: `Your OTP is ${otp}`,
      html: `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Google Palm AI Access Key OTP</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f0f0f0;
                                margin: 0;
                                padding: 0;
                            }

                            .container {
                                max-width: 600px;
                                margin: 0 auto;
                                background-color: #ffffff;
                                border-radius: 5px;
                                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
                            }

                            .header {
                                background-color: #0073e6;
                                color: #ffffff;
                                padding: 20px;
                                text-align: center;
                                border-top-left-radius: 5px;
                                border-top-right-radius: 5px;
                            }

                            h1 {
                                font-size: 24px;
                                margin: 0;
                            }

                            .content {
                                padding: 20px;
                                text-align: center;
                            }

                            p {
                                font-size: 18px;
                                color: #333333;
                                margin: 0;
                            }

                            .otp {
                                font-size: 32px;
                                font-weight: bold;
                                color: #0073e6;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="header">
                                <h1>Google Palm AI Access Key OTP</h1>
                            </div>
                            <div class="content">
                                <p>Your One-Time Password (OTP) is:</p>
                                <p class="otp">${otp}</p>
                            </div>
                        </div>
                    </body>
                </html>
                `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
}