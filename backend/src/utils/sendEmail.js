const sgMail = require("@sendgrid/mail");
const env = require("../../example.env");

// Defensive config load from env file. Use centralized config.
if (!env.SENDGRID_API_KEY || !env.SMTP_FROM) {
    throw new Error("SENDGRID_API_KEY and SMTP_FROM must be defined in environment/config");
}

sgMail.setApiKey(env.SENDGRID_API_KEY);


async function sendEmail({ to, subject, text, html }) {
    if (!to) throw new Error("Missing email recipient");
    if (!subject) throw new Error("Missing email subject");
    if (!text && !html) throw new Error("Missing email content");

    try {
        const [result] = await sgMail.send({
            to,
            from: env.SMTP_FROM,
            subject,
            text,
            html
        });
        return result;
    } catch (err) { 
        if (err.response && err.response.body && err.response.body.errors) {
            console.error("Failed to send email", {
                to,
                subject,
                errors: err.response.body.errors
            });
        } else {
            console.error("Failed to send email", {
                to,
                subject,
                err: err.message || err
            });
        } 
        throw new Error("Failed to send email");
    }
}

async function sendOtpEmail(to, code, purpose) {
    if (!to) throw new Error("Recipient email address is required");
    if (!code) throw new Error("OTP code is required");
    if (!purpose || !["verify", "login"].includes(purpose)) {
        throw new Error(`Purpose must be one of "verify" or "login", received "${purpose}"`);
    }

    const isVerification = purpose === "verify";
    const subject = isVerification ? "Verify Your Email Address" : "Your Login Code";

    const textContent = 
`${isVerification ? "Verification" : "Login"} code: ${code}

This code will expire shortly and should only be used by you.
If you did not request this code, please disregard this email.
`;

    const htmlContent = `
        <div style="font-family:Arial,sans-serif;max-width:420px;margin:auto;background-color:#f9fafb;padding:32px 26px;border-radius:10px;border:1px solid #e3e7ed;">
            <h2 style="color:#222b45;font-size:24px;margin-bottom:18px;">${subject}</h2>
            <p style="font-size:16px;">Please enter the following code:</p>
            <div style="display:inline-block;font-size:34px;letter-spacing:8px;font-weight:600;background-color:#e8f0fe;padding:14px 0;margin:18px 0 18px 0;border-radius:8px;text-align:center;width:100%;">
                ${code}
            </div>
            <p style="font-size:15px;">This code will expire soon. If you did not request this email, you can safely ignore it.</p>
            <p style="color:#7b8794;font-size:13px;margin-top:20px;">&mdash; The Support Team</p>
        </div>
    `;

    return sendEmail({
        to,
        subject,
        text: textContent,
        html: htmlContent
    });
}

module.exports = { sendEmail, sendOtpEmail };