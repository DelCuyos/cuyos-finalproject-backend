import nodemailer from 'nodemailer';
 
let fileConfig: any = {};
try {
    fileConfig = require('../config.json');
} catch (e) {
    // config.json not present in production — that's fine
}
 
export default async function sendEmail({ to, subject, html, from }: any) {
    // Use Resend HTTP API if API key is set (recommended on Render)
    if (process.env.RESEND_API_KEY) {
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: from || process.env.EMAIL_FROM || fileConfig.emailFrom,
                to,
                subject,
                html
            })
        });
        if (!res.ok) {
            const err = await res.text();
            throw `Resend error: ${err}`;
        }
        return;
    }
 
    // Fall back to SMTP (local dev with Ethereal, or any SMTP provider)
    const transporter = nodemailer.createTransport(getSmtpOptions());
    await transporter.sendMail({
        from: from || process.env.EMAIL_FROM || fileConfig.emailFrom,
        to,
        subject,
        html
    });
}
 
function getSmtpOptions() {
    if (process.env.SMTP_HOST) {
        return {
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: process.env.SMTP_USER ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            } : undefined
        };
    }
 
    if (fileConfig.smtpOptions) {
        return fileConfig.smtpOptions;
    }
 
    throw 'No email configuration found. Set SMTP_HOST or RESEND_API_KEY environment variable.';
}