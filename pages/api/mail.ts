import nodemailer from "nodemailer";
import { NextApiRequest, NextApiResponse } from "next";
import methodNotAllowed from "./utils/methodNotAllowed";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        if (req.method !== "POST") return methodNotAllowed(res);

        const { to, from, subject, text, html } = req.body;

        if (!to || !subject) {
            return res.status(400).json({ error: "Missing fields" });
        }

        // Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            secure: true,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"Google Palm Ai" <${process.env.GMAIL_USER}>`,
            to: to,
            subject: subject,
            text: text || '',
            html: html || '',
        };

        // Send email
        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true });
    } catch (error: any) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};