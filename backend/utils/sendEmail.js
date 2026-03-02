const nodemailer = require("nodemailer");
const dns = require("dns");

// Force IPv4 globally to avoid Render's ENETUNREACH IPv6 issues
if (dns.setDefaultResultOrder) {
    dns.setDefaultResultOrder("ipv4first");
}

const sendEmail = async (options) => {
    // 1. Mandatory Credential Check
    if (
        !process.env.EMAIL_USERNAME ||
        process.env.EMAIL_USERNAME === "your_email@gmail.com"
    ) {
        console.log("----------------------------------------------------");
        console.log("MOCK EMAIL SERVICE (Missing EMAIL_USERNAME)");
        console.log(`To: ${options.email}`);
        console.log(`Subject: ${options.subject}`);
        console.log("----------------------------------------------------");
        return;
    }

    // 2. Ultimate Gmail configuration for Render
    // Using 'service: gmail' is more robust than manual host/port
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: (process.env.EMAIL_PASSWORD || "").trim().replace(/\s/g, ""), // Automatically remove spaces from App Password
        },
        tls: {
            // This prevents issues with certificates in internal networks
            rejectUnauthorized: false
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_FROM || process.env.EMAIL_USERNAME,
        to: options.email,
        subject: options.subject,
        html: options.text,
    };

    try {
        console.log(`Attempting to send email to: ${options.email}...`);
        const info = await transporter.sendMail(mailOptions);
        console.log("Email sent successfully! ID:", info.messageId);
    } catch (error) {
        // Log the specific error to Render console for debugging
        console.error("SMTP Error detected:", error.message);
        if (error.code === 'EAUTH') {
            console.error("CRITICAL: Authentication failed. Please verify EMAIL_PASSWORD is an App Password.");
        }
        throw error;
    }
};

module.exports = sendEmail;
